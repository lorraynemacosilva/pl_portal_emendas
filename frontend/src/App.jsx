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
  cinza2: "#71767A",
  borda: "#D8E0EA",
  fundo: "#F4F7FA",
  branco: "#FFFFFF",
};

const MUNICIPAIS_URL = "https://emendas-fiscal-hub.base44.app/";

const ANOS_DISPONIVEIS = [2025]; // por enquanto só 2025, depois é só adicionar 2024, 2023, etc.

function formatCurrency(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function normNivel(s) {
  return String(s || "").trim().toLowerCase();
}

function NivelPill({ nivel }) {
  const n = normNivel(nivel);
  const isFederal = n === "federal";
  const bg = isFederal ? "rgba(0,94,162,0.12)" : "rgba(37,217,193,0.14)";
  const fg = isFederal ? colors.azulEscuro : "#0F766E";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 12px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        border: `1px solid ${colors.borda}`,
        whiteSpace: "nowrap",
      }}
    >
      {nivel}
    </span>
  );
}

function Kpi({ icon, label, value, accent = "verde" }) {
  const accentColor = accent === "azul" ? colors.azulEscuro : colors.verde;
  const iconBg =
    accent === "azul"
      ? "rgba(36,145,255,0.14)"
      : "rgba(37,217,193,0.16)";

  return (
    <div
      style={{
        background: colors.branco,
        border: `1px solid ${colors.borda}`,
        borderRadius: 28,
        padding: 34,
        boxShadow: "0 14px 35px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: iconBg,
            color: colors.azulEscuro,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              color: colors.cinza2,
              fontWeight: 950,
              textTransform: "uppercase",
              letterSpacing: 1.6,
            }}
          >
            {label}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 34,
              fontWeight: 950,
              color: accentColor,
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelCard({ title, subtitle, onClick, variant, iconOverride, cta = "Explorar" }) {
  const isFederal = variant === "federal";
  const isMunicipal = variant === "municipal";

  const bg = isFederal ? colors.azulEscuro : isMunicipal ? "#0F766E" : colors.verde;
  const hover = isFederal ? colors.azulClaro : isMunicipal ? "#0d5f5a" : "#1fbda9";

  const icon = iconOverride
    ? iconOverride
    : isFederal
      ? <Landmark size={48} />
      : <Building2 size={48} />;

  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        width: "100%",
        background: bg,
        color: "#fff",
        borderRadius: 34,
        padding: 64,
        textAlign: "left",
        display: "grid",
        gap: 28,
        cursor: "pointer",
        boxShadow: "0 22px 55px rgba(0,0,0,0.14)",
        transition: "0.16s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
    >
      <div
        style={{
          width: 94,
          height: 94,
          borderRadius: 24,
          background: "rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      <div style={{ fontSize: 40, fontWeight: 950, lineHeight: 1.05 }}>
        {title}
      </div>

      <div
        style={{
          fontSize: 18,
          opacity: 0.95,
          maxWidth: 540,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </div>

      <div
        style={{
          fontWeight: 950,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {cta} <ChevronRight size={26} />
      </div>
    </button>
  );
}

function TopControls({ filterAno, setFilterAno, showDebug, setShowDebug, showDebugToggle = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {showDebugToggle && (
        <button
          onClick={() => setShowDebug((v) => !v)}
          style={{
            border: `1px solid ${colors.borda}`,
            background: "#fff",
            borderRadius: 14,
            padding: "10px 12px",
            fontWeight: 900,
            color: colors.cinza,
            cursor: "pointer",
          }}
          title="Mostrar/ocultar debug do JSON do detalhe"
        >
          Debug
        </button>
      )}

      <span style={{ fontSize: 12, fontWeight: 950, color: colors.cinza2 }}>
        Ano
      </span>

      <select
        value={filterAno}
        onChange={(e) => setFilterAno(Number(e.target.value))}
        style={{
          padding: "12px 14px",
          borderRadius: 14,
          border: `1px solid ${colors.borda}`,
          fontWeight: 900,
          background: "#fff",
          minWidth: 140,
        }}
      >
        {ANOS_DISPONIVEIS.map((ano) => (
          <option key={ano} value={ano}>
            {ano}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home"); // home | level | detail
  const [filterAno, setFilterAno] = useState(ANOS_DISPONIVEIS[0] ?? 2025);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedParlamentarId, setSelectedParlamentarId] = useState(null);

  const [resumo, setResumo] = useState(null);
  const [parlamentares, setParlamentares] = useState([]);
  const [parlamentarDetail, setParlamentarDetail] = useState(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [showDebug, setShowDebug] = useState(false);

  const titleLevel = useMemo(() => {
    if (selectedLevel === "Federal") return "Emendas Federais";
    if (selectedLevel === "Estadual") return "Emendas Estaduais";
    return "";
  }, [selectedLevel]);

  useEffect(() => {
    fetchResumo(filterAno).then(setResumo).catch(console.error);
  }, [filterAno]);

  useEffect(() => {
    if (view !== "level" || !selectedLevel) return;
    fetchParlamentares(selectedLevel, filterAno)
      .then(setParlamentares)
      .catch(console.error);
  }, [view, selectedLevel, filterAno]);

  useEffect(() => {
    if (view !== "detail") return;
    if (!selectedParlamentarId) return;

    setLoadingDetail(true);
    setErrorDetail("");
    setParlamentarDetail(null);

    fetchParlamentarDetail(Number(selectedParlamentarId), filterAno)
      .then((data) => {
        console.log("DETAIL RAW:", data);
        const emendasArr = Array.isArray(data?.emendas) ? data.emendas : [];
        setParlamentarDetail({ ...data, emendas: emendasArr });
      })
      .catch((err) => {
        console.error(err);
        setErrorDetail("Não foi possível carregar o detalhamento deste parlamentar.");
      })
      .finally(() => setLoadingDetail(false));
  }, [view, selectedParlamentarId, filterAno]);

  const goHome = () => {
    setView("home");
    setSelectedLevel(null);
    setSelectedParlamentarId(null);
    setParlamentarDetail(null);
    setErrorDetail("");
  };

  const openMunicipais = () => {
    window.open(MUNICIPAIS_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.fundo }}>
      <main style={{ maxWidth: 1680, margin: "0 auto", padding: "44px 44px 64px" }}>
        {/* HOME */}
        {view === "home" && resumo && (
          <div style={{ display: "grid", gap: 28 }}>
            {/* controles (sem header, bom pra embed) */}
            <TopControls
              filterAno={filterAno}
              setFilterAno={setFilterAno}
              showDebug={showDebug}
              setShowDebug={setShowDebug}
              showDebugToggle={false}
            />

            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  margin: 0,
                  color: colors.azulEscuro,
                  fontWeight: 950,
                  textTransform: "uppercase",
                  fontSize: 52,
                  letterSpacing: -1,
                }}
              >
                Transparência em Foco
              </h1>
              <p
                style={{
                  margin: "14px auto 0",
                  maxWidth: 920,
                  color: colors.cinza,
                  fontSize: 19,
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                Consulte informações consolidadas sobre os recursos oriundos de emendas parlamentares destinadas ao Município de Pedro Leopoldo.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: 26,
              }}
            >
              <Kpi icon={<Database size={28} />} label="Total Geral" value={formatCurrency(resumo.totalGeral)} accent="verde" />
              <Kpi icon={<Landmark size={28} />} label="Total Federal" value={formatCurrency(resumo.totalFederal)} accent="azul" />
              <Kpi icon={<Building2 size={28} />} label="Total Estadual" value={formatCurrency(resumo.totalEstadual)} accent="verde" />
              <Kpi icon={<Users size={28} />} label="Parlamentares" value={String(resumo.totalParlamentares)} accent="azul" />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
                gap: 36,
              }}
            >
              <LevelCard
                variant="federal"
                title="Emendas Federais"
                subtitle="Recursos destinados por Deputados Federais e Senadores."
                onClick={() => {
                  setSelectedLevel("Federal");
                  setView("level");
                }}
              />

              <LevelCard
                variant="estadual"
                title="Emendas Estaduais"
                subtitle="Recursos destinados por Deputados Estaduais."
                onClick={() => {
                  setSelectedLevel("Estadual");
                  setView("level");
                }}
              />

              <LevelCard
                variant="municipal"
                title="Emendas Municipais"
                subtitle="Acesse o portal de emendas municipais."
                onClick={openMunicipais}
                iconOverride={<Building2 size={48} />}
                cta="Acessar portal"
              />
            </div>
          </div>
        )}

        {/* LISTA */}
        {view === "level" && (
          <div style={{ display: "grid", gap: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={goHome}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  color: colors.azulClaro,
                  fontWeight: 950,
                  border: "none",
                  background: "transparent",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={18} /> Início
              </button>

              <TopControls
                filterAno={filterAno}
                setFilterAno={setFilterAno}
                showDebug={showDebug}
                setShowDebug={setShowDebug}
                showDebugToggle={false}
              />
            </div>

            <h2
              style={{
                margin: 0,
                color: colors.azulEscuro,
                fontWeight: 950,
                textTransform: "uppercase",
                fontSize: 38,
              }}
            >
              {titleLevel}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
                gap: 26,
              }}
            >
              {parlamentares.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedParlamentarId(Number(p.id));
                    setView("detail");
                  }}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${colors.borda}`,
                    borderRadius: 28,
                    padding: 30,
                    background: "#fff",
                    display: "flex",
                    gap: 22,
                    alignItems: "center",
                    cursor: "pointer",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={p.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar"}
                    alt={p.nome}
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 26,
                      border: `1px solid ${colors.borda}`,
                      background: "#fff",
                      objectFit: "cover",
                      flex: "0 0 auto",
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 950,
                        color: colors.azulEscuro,
                        textTransform: "uppercase",
                        fontSize: 22,
                        lineHeight: 1.15,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={p.nome}
                    >
                      {p.nome}
                    </div>

                    <div style={{ fontSize: 14, color: colors.cinza2, fontWeight: 800, marginTop: 6 }}>
                      {p.cargo}
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 12, color: "#9AA3AF", fontWeight: 950, textTransform: "uppercase", letterSpacing: 1.2 }}>
                        Total {filterAno}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 950, color: colors.verde }}>
                        {formatCurrency(p.total)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      color: colors.azulClaro,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      fontWeight: 950,
                      fontSize: 16,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Ver <ChevronRight size={24} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DETALHE */}
        {view === "detail" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={() => setView("level")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  color: colors.azulClaro,
                  fontWeight: 950,
                  border: "none",
                  background: "transparent",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={18} /> Voltar
              </button>

              <TopControls
                filterAno={filterAno}
                setFilterAno={setFilterAno}
                showDebug={showDebug}
                setShowDebug={setShowDebug}
                showDebugToggle={true}
              />
            </div>

            {loadingDetail && (
              <div style={{ padding: 16, fontWeight: 900, color: colors.cinza }}>
                Carregando detalhamento...
              </div>
            )}

            {!loadingDetail && errorDetail && (
              <div
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: "#fff",
                  border: `1px solid ${colors.borda}`,
                  color: colors.cinza,
                  fontWeight: 900,
                }}
              >
                {errorDetail}
              </div>
            )}

            {!loadingDetail && parlamentarDetail && (
              <>
                <div
                  style={{
                    border: `1px solid ${colors.borda}`,
                    borderRadius: 30,
                    padding: 34,
                    background: "#fff",
                    display: "flex",
                    gap: 26,
                    alignItems: "center",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={parlamentarDetail.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar"}
                    alt={parlamentarDetail.nome}
                    style={{
                      width: 190,
                      height: 190,
                      borderRadius: 30,
                      border: `1px solid ${colors.borda}`,
                      background: "#fff",
                      objectFit: "cover",
                      flex: "0 0 auto",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 950, color: colors.azulEscuro, textTransform: "uppercase", fontSize: 30 }}>
                      {parlamentarDetail.nome}
                    </div>

                    <div style={{ marginTop: 8, fontSize: 14, color: colors.cinza2, fontWeight: 900, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span>{parlamentarDetail.cargo}</span>
                      <span>•</span>
                      <NivelPill nivel={parlamentarDetail.nivel} />
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 12, color: "#9AA3AF", fontWeight: 950, textTransform: "uppercase", letterSpacing: 1.2 }}>
                        Total {filterAno}
                      </div>
                      <div style={{ marginTop: 6, fontSize: 30, fontWeight: 950, color: colors.verde }}>
                        {formatCurrency(parlamentarDetail.total)}
                      </div>
                    </div>
                  </div>
                </div>

                {showDebug && (
                  <pre
                    style={{
                      background: "#0b1220",
                      color: "#e5e7eb",
                      padding: 16,
                      borderRadius: 18,
                      overflowX: "auto",
                      fontSize: 12,
                      border: `1px solid ${colors.borda}`,
                    }}
                  >
                    {JSON.stringify(parlamentarDetail, null, 2)}
                  </pre>
                )}

                <div
                  style={{
                    border: `1px solid ${colors.borda}`,
                    borderRadius: 30,
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 22px",
                      background: colors.azulEscuro,
                      color: "#fff",
                      fontWeight: 950,
                      textTransform: "uppercase",
                      letterSpacing: 1.1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Detalhamento das Emendas</span>
                    <span style={{ fontSize: 12, opacity: 0.95 }}>
                      {parlamentarDetail.emendas?.length || 0} registros
                    </span>
                  </div>

                  {(!parlamentarDetail.emendas || parlamentarDetail.emendas.length === 0) ? (
                    <div style={{ padding: 18, color: colors.cinza2, fontWeight: 900 }}>
                      Nenhuma emenda encontrada para este parlamentar no ano {filterAno}.
                      <div style={{ marginTop: 8, fontWeight: 700, color: colors.cinza }}>
                        (Se você acha que deveria ter, ative o botão <b>Debug</b> e me mande o JSON.)
                      </div>
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#F8FAFC", color: "#64748B", textTransform: "uppercase", letterSpacing: 1.1, fontSize: 12 }}>
                            <th style={{ textAlign: "left", padding: 16 }}>Programa / Modalidade</th>
                            <th style={{ textAlign: "center", padding: 16 }}>Ano</th>
                            <th style={{ textAlign: "center", padding: 16 }}>Nível</th>
                            <th style={{ textAlign: "right", padding: 16 }}>Valor Repasse</th>
                          </tr>
                        </thead>

                        <tbody>
                          {parlamentarDetail.emendas.map((e) => (
                            <tr key={e.id} style={{ borderTop: `1px solid ${colors.borda}` }}>
                              <td style={{ padding: 16, fontWeight: 800, color: colors.cinza }}>
                                {e.programa}
                              </td>
                              <td style={{ padding: 16, textAlign: "center", fontWeight: 800, color: colors.cinza2 }}>
                                {e.ano}
                              </td>
                              <td style={{ padding: 16, textAlign: "center" }}>
                                <NivelPill nivel={e.nivel} />
                              </td>
                              <td style={{ padding: 16, textAlign: "right", fontWeight: 950, color: colors.verde, fontSize: 16 }}>
                                {formatCurrency(e.valor)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div style={{ padding: 16, fontSize: 12, color: colors.cinza2, fontWeight: 900 }}>
                    * Valores exibidos conforme registros do ano selecionado.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}