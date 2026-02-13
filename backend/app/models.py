from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base

class Parlamentar(Base):
    __tablename__ = "parlamentares"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    cargo = Column(String(255), nullable=False)
    nivel = Column(String(50), nullable=False)  # Federal | Estadual | Municipal (se quiser)
    avatar_url = Column(String, nullable=True)

    emendas = relationship("Emenda", back_populates="parlamentar", cascade="all, delete-orphan")

class Emenda(Base):
    __tablename__ = "emendas"

    id = Column(Integer, primary_key=True, index=True)
    parlamentar_id = Column(Integer, ForeignKey("parlamentares.id", ondelete="CASCADE"), nullable=False)
    valor = Column(Numeric(14, 2), nullable=False)
    programa = Column(String, nullable=False)
    ano = Column(Integer, nullable=False)
    nivel = Column(String(50), nullable=False)  # redundante por simplicidade/consulta rápida

    parlamentar = relationship("Parlamentar", back_populates="emendas")
