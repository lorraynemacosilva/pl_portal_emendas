import os
from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from . import crud
from .schemas import ResumoOut, ParlamentarOut, EmendaOut, ParlamentarDetailOut

# cria tabelas automaticamente (MVP)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portal de Emendas - Pedro Leopoldo")

cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/resumo", response_model=ResumoOut)
def resumo(db: Session = Depends(get_db)):
    return crud.get_resumo(db)

@app.get("/parlamentares", response_model=list[ParlamentarOut])
def parlamentares(
    nivel: str = Query(..., pattern="^(Federal|Estadual|Municipal)$"),
    ano: int = Query(..., ge=2000, le=2100),
    db: Session = Depends(get_db),
):
    return crud.list_parlamentares(db, nivel=nivel, ano=ano)

@app.get("/parlamentares/{parlamentar_id}", response_model=ParlamentarDetailOut)
def parlamentar_detail(
    parlamentar_id: int,
    ano: int = Query(..., ge=2000, le=2100),
    db: Session = Depends(get_db),
):
    data = crud.get_parlamentar_detail(db, parlamentar_id=parlamentar_id, ano=ano)
    if not data:
        raise HTTPException(status_code=404, detail="Parlamentar não encontrado")
    return data

@app.get("/parlamentares/{parlamentar_id}/emendas", response_model=list[EmendaOut])
def emendas_parlamentar(
    parlamentar_id: int,
    ano: int = Query(..., ge=2000, le=2100),
    db: Session = Depends(get_db),
):
    return crud.list_emendas_by_parlamentar(db, parlamentar_id=parlamentar_id, ano=ano)
