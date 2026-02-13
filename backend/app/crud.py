from sqlalchemy.orm import Session
from sqlalchemy import func
from .models import Parlamentar, Emenda

def get_resumo(db: Session):
    total_geral = db.query(func.coalesce(func.sum(Emenda.valor), 0)).scalar()
    total_federal = db.query(func.coalesce(func.sum(Emenda.valor), 0)).filter(Emenda.nivel == "Federal").scalar()
    total_estadual = db.query(func.coalesce(func.sum(Emenda.valor), 0)).filter(Emenda.nivel == "Estadual").scalar()
    total_parlamentares = db.query(func.count(Parlamentar.id)).scalar()

    return {
        "totalGeral": float(total_geral or 0),
        "totalFederal": float(total_federal or 0),
        "totalEstadual": float(total_estadual or 0),
        "totalParlamentares": int(total_parlamentares or 0),
    }

def list_parlamentares(db: Session, nivel: str, ano: int):
    # retorna parlamentares do nivel e o total das emendas no ano
    rows = (
        db.query(
            Parlamentar.id,
            Parlamentar.nome,
            Parlamentar.cargo,
            Parlamentar.nivel,
            Parlamentar.avatar_url,
            func.coalesce(func.sum(Emenda.valor), 0).label("total"),
        )
        .join(Emenda, Emenda.parlamentar_id == Parlamentar.id)
        .filter(Parlamentar.nivel == nivel)
        .filter(Emenda.ano == ano)
        .group_by(Parlamentar.id)
        .order_by(func.sum(Emenda.valor).desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "nome": r.nome,
            "cargo": r.cargo,
            "nivel": r.nivel,
            "avatar_url": r.avatar_url,
            "total": float(r.total or 0),
        }
        for r in rows
    ]

def list_emendas_by_parlamentar(db: Session, parlamentar_id: int, ano: int):
    emendas = (
        db.query(Emenda)
        .filter(Emenda.parlamentar_id == parlamentar_id)
        .filter(Emenda.ano == ano)
        .order_by(Emenda.valor.desc())
        .all()
    )
    return [
        {
            "id": e.id,
            "parlamentar_id": e.parlamentar_id,
            "valor": float(e.valor),
            "programa": e.programa,
            "ano": e.ano,
            "nivel": e.nivel,
        }
        for e in emendas
    ]

def get_parlamentar_detail(db: Session, parlamentar_id: int, ano: int):
    p = db.query(Parlamentar).filter(Parlamentar.id == parlamentar_id).first()
    if not p:
        return None

    emendas = list_emendas_by_parlamentar(db, parlamentar_id, ano)
    total = sum(e["valor"] for e in emendas)

    return {
        "id": p.id,
        "nome": p.nome,
        "cargo": p.cargo,
        "nivel": p.nivel,
        "avatar_url": p.avatar_url,
        "total": float(total),
        "emendas": emendas,
    }