import os
import pandas as pd
from sqlalchemy import create_engine, text

DATABASE_URL = os.environ["DATABASE_URL"]
SHEETS_CSV_URL = os.environ.get("SHEETS_CSV_URL")
MODE = os.environ.get("MODE", "replace")  # replace | append

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

REQUIRED_COLS = ["nivel", "parlamentar", "cargo", "valor_repasse", "programa_modalidade", "ano", "avatar_url"]

def load_dataframe():
    if not SHEETS_CSV_URL:
        raise ValueError("Defina a variável de ambiente SHEETS_CSV_URL (link CSV do Google Sheets).")

    # pandas lê CSV direto de URL
    df = pd.read_csv(SHEETS_CSV_URL)
    return df

def main():
    df = load_dataframe()

    missing = [c for c in REQUIRED_COLS if c not in df.columns]
    if missing:
        raise ValueError(f"Planilha/CSV faltando colunas: {missing}")

    # normalização
    df["nivel"] = df["nivel"].astype(str).str.strip()
    df["parlamentar"] = df["parlamentar"].astype(str).str.strip()
    df["cargo"] = df["cargo"].astype(str).str.strip()
    df["programa_modalidade"] = df["programa_modalidade"].astype(str).str.strip()
    df["ano"] = df["ano"].astype(int)
    df["valor_repasse"] = pd.to_numeric(df["valor_repasse"], errors="coerce").fillna(0)
    df["avatar_url"] = df["avatar_url"].astype(str).fillna("").str.strip()

    with engine.begin() as conn:
        if MODE == "replace":
            conn.execute(text("TRUNCATE TABLE emendas RESTART IDENTITY CASCADE;"))
            conn.execute(text("TRUNCATE TABLE parlamentares RESTART IDENTITY CASCADE;"))

        parl_unique = df[["parlamentar", "nivel", "cargo", "avatar_url"]].drop_duplicates()

        parlamentar_id_map = {}
        for _, row in parl_unique.iterrows():
            r = conn.execute(
                text("""
                    INSERT INTO parlamentares (nome, cargo, nivel, avatar_url)
                    VALUES (:nome, :cargo, :nivel, :avatar_url)
                    RETURNING id
                """),
                {
                    "nome": row["parlamentar"],
                    "cargo": row["cargo"],
                    "nivel": row["nivel"],
                    "avatar_url": row["avatar_url"] if row["avatar_url"] else None,
                }
            ).fetchone()
            parlamentar_id_map[(row["parlamentar"], row["nivel"], row["cargo"])] = int(r[0])

        for _, row in df.iterrows():
            pid = parlamentar_id_map[(row["parlamentar"], row["nivel"], row["cargo"])]
            conn.execute(
                text("""
                    INSERT INTO emendas (parlamentar_id, valor, programa, ano, nivel)
                    VALUES (:pid, :valor, :programa, :ano, :nivel)
                """),
                {
                    "pid": pid,
                    "valor": float(row["valor_repasse"]),
                    "programa": row["programa_modalidade"],
                    "ano": int(row["ano"]),
                    "nivel": row["nivel"],
                }
            )

    print("Importação do Google Sheets concluída com sucesso!")

if __name__ == "__main__":
    main()