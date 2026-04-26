"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Home() {

  const [form, setForm] = useState<any>({
    nombre: "",
    sesion: "",
    fecha: "",

    comentario_emocional: "",
    comentario_social: ""
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const generarPDF = () => {
  const pdf = new jsPDF();

  let y = 15;

  //////////////////////
  // HEADER
  //////////////////////
  pdf.setFontSize(16);
  pdf.text("Reporte de sesión", 14, y);

  y += 8;

  pdf.setFontSize(11);
  pdf.text(`Nombre: ${form.nombre}`, 14, y);
  y += 6;
  pdf.text(`Sesión: ${form.sesion}`, 14, y);
  y += 6;
  pdf.text(`Fecha: ${form.fecha}`, 14, y);

  y += 10;

  //////////////////////
// FUNCIÓN HABILIDAD
//////////////////////
const tablaHabilidad = (titulo: string, prefix: string, indicadores: string[]) => {

  // Reset de estilos (evita bugs visuales)
  pdf.setTextColor(60, 60, 60);
  pdf.setFont("helvetica", "normal");

  // Título de la habilidad
  pdf.setFontSize(12);
  pdf.setTextColor(88, 128, 148); // azul TK
  pdf.text(titulo, 14, y);

  y += 4;

  autoTable(pdf, {
    startY: y,

    head: [["Habilidad", "No observado", "En proceso", "Logrado"]],

    body: indicadores.map((ind, i) => {
      const key = `${prefix}_${i}`;
      const val = form[key];

      return [
        ind,
        val === "No observado" ? "X" : "",
        val === "En proceso" ? "X" : "",
        val === "Logrado" ? "X" : ""
      ];
    }),

    theme: "plain",

    styles: {
      fontSize: 10,
      cellPadding: 5,
      textColor: [60, 60, 60],
      halign: "center",
      valign: "middle"
    },

    headStyles: {
      fillColor: [155, 202, 213], // azul Casa TK
      textColor: 20,
      fontStyle: "bold"
    },

    bodyStyles: {
      fillColor: [255, 255, 255]
    },

    alternateRowStyles: {
      fillColor: [240, 248, 250] // azul suave
    },

    columnStyles: {
      0: { halign: "left", cellWidth: 100 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 }
    },

    margin: { left: 14, right: 14 }
  });

  y = pdf.lastAutoTable.finalY + 10;

  if (y > 260) {
    pdf.addPage();
    y = 15;
  }
};

  //////////////////////
  // 🔷 EMOCIONAL
  //////////////////////
  pdf.setFontSize(14);
pdf.setTextColor(47, 93, 103);
pdf.text("Habilidades emocionales", 14, y);
y += 6;

  tablaHabilidad("Conoce las emociones", "emo1", [
    "Identifica emociones básicas",
    "Nombra cómo se siente",
    "Diferencia emociones"
  ]);

  tablaHabilidad("Reconoce emociones en su cuerpo", "emo2", [
    "Identifica sensaciones físicas",
    "Relaciona emoción y cuerpo"
  ]);

  tablaHabilidad("Expresa lo que siente", "emo3", [
    "Comunica emociones verbalmente",
    "Evita conductas disruptivas",
    "Pide ayuda"
  ]);

  tablaHabilidad("Regulación emocional", "emo4", [
    "Identifica estrategias",
    "Usa estrategias",
    "Recupera la calma"
  ]);

  //////////////////////
  // 🔷 SOCIAL
  //////////////////////
  pdf.setFontSize(14);
  pdf.setTextColor(47, 93, 103);
  pdf.text("Habilidades sociales", 14, y);
  y += 6;

tablaHabilidad("Iniciativa social", "soc1", [
  "Se acerca a otros niños para interactuar",
  "Inicia juegos o conversaciones",
  "Busca integrarse a actividades grupales",
  "Encuentra formas de participar cuando otros ya están jugando"
]);

tablaHabilidad("Comunicación social", "soc2", [
  "Inicia y mantiene conversaciones acordes a su edad",
  "Respeta turnos al hablar",
  "Escucha a los demás durante la interacción",
  "Utiliza contacto visual u otras formas de conexión",
  "Comprende bromas simples o intenciones sociales básicas"
]);

tablaHabilidad("Juego social", "soc3", [
  "Juega con otros niños (no solo de forma individual)",
  "Sigue reglas básicas del juego",
  "Tolera perder o esperar turnos",
  "Permanece en el juego sin abandonarlo rápidamente"
]);

tablaHabilidad("Resolución de conflictos", "soc4", [
  "Escucha al otro durante un conflicto",
  "Expresa su punto de vista sin agresión",
  "Busca soluciones o acuerdos",
  "Pide ayuda a un adulto cuando lo necesita"
]);

tablaHabilidad("Empatía y lectura social", "soc5", [
  "Reconoce emociones en otras personas",
  "Responde de forma adecuada a las emociones de otros",
  "Ajusta su conducta según el contexto social",
  "Respeta límites físicos y emocionales"
]);

  //////////////////////
  // OBSERVACIONES
  //////////////////////
  pdf.setFontSize(12);
  pdf.text("Observaciones", 14, y);

  const texto =
    `${form.comentario_emocional || ""}\n\n${form.comentario_social || ""}`;

  const lines = pdf.splitTextToSize(texto, 180);
  pdf.text(lines, 14, y + 6);

  //////////////////////
  // GUARDAR
  //////////////////////
  pdf.save(`Reporte-${form.nombre || "sin_nombre"}.pdf`);
};

  return (
    <div className="min-h-screen bg-[#EFEAE1] flex justify-center p-6">

      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow">

        <h1 className="text-2xl font-bold text-center text-[#2F5D67] mb-6">
          Evaluación Casa TK
        </h1>

        {/* INPUTS (YA SIN OPACIDAD) */}
        <input
          placeholder="Nombre"
          className="w-full p-3 border rounded-lg mb-2 text-gray-900 placeholder-gray-400 font-medium"
          onChange={(e) => handleChange("nombre", e.target.value)}
        />

        <input
          placeholder="Sesión"
          className="w-full p-3 border rounded-lg mb-2 text-gray-900 placeholder-gray-400 font-medium"
          onChange={(e) => handleChange("sesion", e.target.value)}
        />

        <input
          type="date"
          className="w-full p-3 border rounded-lg mb-4 text-gray-900"
          onChange={(e) => handleChange("fecha", e.target.value)}
        />

        {/* ========================= */}
        {/* 🔷 EMOCIONAL */}
        {/* ========================= */}

        <Dimension
          titulo="Habilidades emocionales"
          comentarioKey="comentario_emocional"
          form={form}
          handleChange={handleChange}
        >

          <Habilidad
            titulo="Conoce las emociones"
            indicadores={[
              "Identifica emociones básicas",
              "Nombra cómo se siente",
              "Diferencia emociones"
            ]}
            prefix="emo1"
            form={form}
            handleChange={handleChange}
          />

          <Habilidad
            titulo="Reconoce emociones en su cuerpo"
            indicadores={[
              "Identifica sensaciones físicas",
              "Relaciona emoción y cuerpo"
            ]}
            prefix="emo2"
            form={form}
            handleChange={handleChange}
          />

          <Habilidad
            titulo="Expresa lo que siente"
            indicadores={[
              "Comunica emociones verbalmente",
              "Evita conductas disruptivas",
              "Pide ayuda"
            ]}
            prefix="emo3"
            form={form}
            handleChange={handleChange}
          />

          <Habilidad
            titulo="Regulación emocional"
            indicadores={[
              "Identifica estrategias",
              "Usa estrategias",
              "Recupera la calma"
            ]}
            prefix="emo4"
            form={form}
            handleChange={handleChange}
          />

        </Dimension>

        {/* ========================= */}
        {/* 🔷 SOCIAL */}
        {/* ========================= */}

        <Dimension
  titulo="Habilidades sociales"
  comentarioKey="comentario_social"
  form={form}
  handleChange={handleChange}
>

  <Habilidad
    titulo="Iniciativa social"
    indicadores={[
      "Se acerca a otros niños para interactuar",
      "Inicia juegos o conversaciones",
      "Busca integrarse a actividades grupales",
      "Encuentra formas de participar cuando otros ya están jugando"
    ]}
    prefix="soc1"
    form={form}
    handleChange={handleChange}
  />

  <Habilidad
    titulo="Comunicación social"
    indicadores={[
      "Inicia y mantiene conversaciones acordes a su edad",
      "Respeta turnos al hablar",
      "Escucha a los demás durante la interacción",
      "Utiliza contacto visual u otras formas de conexión",
      "Comprende bromas simples o intenciones sociales básicas"
    ]}
    prefix="soc2"
    form={form}
    handleChange={handleChange}
  />

  <Habilidad
    titulo="Juego social"
    indicadores={[
      "Juega con otros niños (no solo de forma individual)",
      "Sigue reglas básicas del juego",
      "Tolera perder o esperar turnos",
      "Permanece en el juego sin abandonarlo rápidamente"
    ]}
    prefix="soc3"
    form={form}
    handleChange={handleChange}
  />

  <Habilidad
    titulo="Resolución de conflictos"
    indicadores={[
      "Escucha al otro durante un conflicto",
      "Expresa su punto de vista sin agresión",
      "Busca soluciones o acuerdos",
      "Pide ayuda a un adulto cuando lo necesita"
    ]}
    prefix="soc4"
    form={form}
    handleChange={handleChange}
  />

  <Habilidad
    titulo="Empatía y lectura social"
    indicadores={[
      "Reconoce emociones en otras personas",
      "Responde de forma adecuada a las emociones de otros",
      "Ajusta su conducta según el contexto social",
      "Respeta límites físicos y emocionales"
    ]}
    prefix="soc5"
    form={form}
    handleChange={handleChange}
  />

</Dimension>
        <button
  onClick={generarPDF}
  className="w-full mt-6 bg-[#2F5D67] hover:bg-[#274d55] text-white p-3 rounded-lg font-semibold transition cursor-pointer"
>
  Descargar PDF
</button>

      </div>
    </div>
  );
}

//////////////////////////////
// 🔷 DIMENSIÓN
//////////////////////////////

function Dimension({ titulo, children, comentarioKey, form, handleChange }: any) {
  return (
    <div className="mb-8">

      <h2 className="text-xl font-bold text-[#2F5D67] mb-4">
        {titulo}
      </h2>

      {children}

      <textarea
        placeholder="Comentarios de esta dimensión (opcional)"
        value={form[comentarioKey] || ""}
        onChange={(e) => handleChange(comentarioKey, e.target.value)}
        className="w-full mt-3 p-3 border rounded-lg text-gray-900"
      />

    </div>
  );
}

//////////////////////////////
// 🔹 HABILIDAD
//////////////////////////////

function Habilidad({ titulo, indicadores, form, handleChange, prefix }: any) {
  return (
    <div className="bg-[#EEF3F6] p-4 rounded-xl mb-4">

      <p className="font-semibold text-[#2F5D67] mb-3">
        {titulo}
      </p>

      {indicadores.map((texto: string, i: number) => {

        const name = `${prefix}_${i}`;

        return (
          <div key={name} className="mb-3">

            <p className="text-sm text-gray-800 mb-2 font-medium">
              {texto}
            </p>

            <div className="flex gap-2">
              {["No observado", "En proceso", "Logrado"].map(op => (
                <button
                  key={op}
                  onClick={() => handleChange(name, op)}
                  className={`flex-1 p-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    form[name] === op
                      ? "bg-[#7FB3BF] text-white border-[#2F5D67] scale-105 shadow"
                      : "bg-white text-gray-800 hover:bg-[#DCEEF5] hover:scale-105"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}