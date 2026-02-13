import React, { useEffect, useMemo, useState } from "react";
import {
  Database,
  Landmark,
  Building2,
  Users,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  fetchResumo,
  fetchParlamentares,
  fetchParlamentarDetail,
} from "./services/api";

const colors = {
  azulEscuro: "#005EA2",
  azulClaro: "#2491FF",
  verde: "#25D9C1",
  cinza: "#4D5766",
  borda: "#D8E0EA",
  fundo: "#F4F7FA",
};

function formatCurrency(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function App() {
  const [view, setView] = useState("home");
  const [filterAno, setFilterAno] = useState(2025);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedParlamentarId, setSelectedParlamentarId] = useState(null);

  const [resumo, setResumo] = useState(null);
  const [parlamentares, setParlamentares] = useState([]);
  const [parlamentarDetail, setParlamentarDetail] = useState(null);

  const titleLevel = useMemo(() => {
    if (selectedLevel === "Federal") return "Emendas Federais";
    if (selectedLevel === "Estadual") return "Emendas Estaduais";
    return "";
  }, [selectedLevel]);

  useEffect(() => {
    fetchResumo().then(setResumo).catch(console.error);
  }, []);

  useEffect(() => {
    if (view !== "level" || !selectedLevel) return;
    fetchParlamentares(selectedLevel, filterAno)
      .then(setParlamentares)
      .catch(console.error);
  }, [view, selectedLevel, filterAno]);

  useEffect(() => {
    if (view !== "detail" || !selectedParlamentarId) return;
    fetchParlamentarDetail(selectedParlamentarId, filterAno)
      .then(setParlamentarDetail)
      .catch(console.error);
  }, [view, selectedParlamentarId, filterAno]);

  return (
    <div style={{ minHeight: "100vh", background: colors.fundo }}>
      {/* HEADER */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: `1px solid ${colors.borda}`,
          padding: "20px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 16 }}
            onClick={() => setView("home")}
          >
            <div
              style={{
                background: colors.azulEscuro,
                padding: 16,
                borderRadius: 18,
                color: "#FFF",
              }}
            >
              <Database size={32} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 22,
                  color: colors.azulEscuro,
                  textTransform: "uppercase",
                }}
              >
                Portal de Emendas
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#9AA3AF",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Prefeitura de Pedro Leopoldo
              </div>
            </div>
          </div>

          <div>
            <select
              value={filterAno}
              onChange={(e) => setFilterAno(Number(e.target.value))}
              style={{
                padding: 10,
                borderRadius: 10,
                border: `1px solid ${colors.borda}`,
                fontWeight: 700,
              }}
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1600, margin: "0 auto", padding: 60 }}>
        {/* HOME */}
        {view === "home" && resumo && (
          <>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h1
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: colors.azulEscuro,
                  marginBottom: 16,
                }}
              >
                Transparência em Foco
              </h1>
              <p style={{ fontSize: 18, color: colors.cinza }}>
                Consulte informações consolidadas sobre os recursos oriundos de
                emendas parlamentares destinadas ao Município.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 30,
                marginBottom: 60,
              }}
            >
              <Kpi icon={<Database size={28} />} label="Total Geral" value={formatCurrency(resumo.totalGeral)} />
              <Kpi icon={<Landmark size={28} />} label="Total Federal" value={formatCurrency(resumo.totalFederal)} valueColor={colors.azulEscuro} />
              <Kpi icon={<Building2 size={28} />} label="Total Estadual" value={formatCurrency(resumo.totalEstadual)} />
              <Kpi icon={<Users size={28} />} label="Parlamentares" value={resumo.totalParlamentares} valueColor={colors.azulEscuro} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
              }}
            >
              <LevelCard
                title="Emendas Federais"
                subtitle="Recursos destinados por Deputados Federais e Senadores."
                onClick={() => {
                  setSelectedLevel("Federal");
                  setView("level");
                }}
              />

              <LevelCard
                title="Emendas Estaduais"
                subtitle="Recursos destinados por Deputados Estaduais."
                onClick={() => {
                  setSelectedLevel("Estadual");
                  setView("level");
                }}
              />
            </div>
          </>
        )}

        {/* LISTA */}
        {view === "level" && (
          <>
            <button
              onClick={() => setView("home")}
              style={{
                marginBottom: 30,
                background: "none",
                border: "none",
                color: colors.azulClaro,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={18} /> Voltar
            </button>

            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                marginBottom: 40,
                color: colors.azulEscuro,
              }}
            >
              {titleLevel}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: 30,
              }}
            >
              {parlamentares.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedParlamentarId(p.id);
                    setView("detail");
                  }}
                  style={{
                    background: "#FFF",
                    borderRadius: 24,
                    padding: 30,
                    border: `1px solid ${colors.borda}`,
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", gap: 24 }}>
                    <img
                      src={p.avatar_url}
                      alt={p.nome}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 20,
                        objectFit: "cover",
                        border: `1px solid ${colors.borda}`,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 900,
                          color: colors.azulEscuro,
                        }}
                      >
                        {p.nome}
                      </div>
                      <div style={{ color: colors.cinza, marginBottom: 20 }}>
                        {p.cargo}
                      </div>

                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 900,
                          color: colors.verde,
                        }}
                      >
                        {formatCurrency(p.total)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* DETAIL */}
        {view === "detail" && parlamentarDetail && (
          <>
            <button
              onClick={() => setView("level")}
              style={{
                marginBottom: 30,
                background: "none",
                border: "none",
                color: colors.azulClaro,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={18} /> Voltar
            </button>

            <div
              style={{
                background: "#FFF",
                padding: 40,
                borderRadius: 24,
                border: `1px solid ${colors.borda}`,
                marginBottom: 40,
                display: "flex",
                gap: 40,
                alignItems: "center",
              }}
            >
              <img
                src={parlamentarDetail.avatar_url}
                alt={parlamentarDetail.nome}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 24,
                  objectFit: "cover",
                  border: `1px solid ${colors.borda}`,
                }}
              />

              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: colors.azulEscuro,
                  }}
                >
                  {parlamentarDetail.nome}
                </div>

                <div style={{ marginBottom: 12 }}>
                  {parlamentarDetail.cargo} • {parlamentarDetail.nivel}
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: colors.verde,
                  }}
                >
                  Total: {formatCurrency(parlamentarDetail.total)}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Kpi({ icon, label, value, valueColor }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 24,
        padding: 40,
        border: `1px solid ${colors.borda}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            background: colors.fundo,
            padding: 16,
            borderRadius: 16,
            color: colors.azulEscuro,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 800, color: colors.cinza }}>{label}</div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: valueColor || colors.verde,
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelCard({ title, subtitle, onClick }) {
  const isFederal = title.includes("Federal");

  const icon = isFederal ? (
    <Landmark size={42} />
  ) : (
    <Building2 size={42} />
  );

  const iconColor = isFederal ? colors.azulEscuro : colors.verde;

  return (
    <button
      onClick={onClick}
      style={{
        background: "#FFF",
        borderRadius: 30,
        padding: 50,
        border: `2px solid ${colors.borda}`,
        textAlign: "left",
        display: "grid",
        gap: 24,
        transition: "0.2s",
      }}
    >
      {/* Ícone */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: colors.fundo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
        }}
      >
        {icon}
      </div>

      {/* Título */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: colors.azulEscuro,
        }}
      >
        {title}
      </div>

      {/* Subtítulo */}
      <div
        style={{
          fontSize: 18,
          color: colors.cinza,
        }}
      >
        {subtitle}
      </div>

      {/* CTA */}
      <div
        style={{
          fontWeight: 900,
          color: colors.azulClaro,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 16,
        }}
      >
        Explorar <ChevronRight size={22} />
      </div>
    </button>
  );
}
