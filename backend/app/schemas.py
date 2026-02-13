from pydantic import BaseModel
from typing import Optional, List

class ResumoOut(BaseModel):
    totalGeral: float
    totalFederal: float
    totalEstadual: float
    totalParlamentares: int

class ParlamentarOut(BaseModel):
    id: int
    nome: str
    cargo: str
    nivel: str
    avatar_url: Optional[str] = None
    total: float  # total no ano filtrado

class EmendaOut(BaseModel):
    id: int
    parlamentar_id: int
    valor: float
    programa: str
    ano: int
    nivel: str

class ParlamentarDetailOut(BaseModel):
    id: int
    nome: str
    cargo: str
    nivel: str
    avatar_url: Optional[str] = None
    total: float
    emendas: List[EmendaOut]
