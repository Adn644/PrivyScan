import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import grass from "../assets/grass.png";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa6";


const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const overallGrade = location.state?.overallGrade ?? "";
  const chunks = location.state?.chunks ?? [];
  const summary = location.state?.summary ?? "";
  const analysisError = location.state?.analysisError ?? "";
  const pageUrl = location.state?.pageUrl ?? "";

  const getGradeColor = (grade) => {
    const gradeColors = {
      A: "bg-green-500",
      B: "bg-blue-500",
      C: "bg-yellow-500",
      D: "bg-orange-500",
      E: "bg-red-500",
    };
    return gradeColors[grade] || "bg-gray-500";
  };

  const getLabelColor = (label) => {
    const labelColors = {
      good: "text-green-600",
      bad: "text-red-600",
      blocker: "text-red-800",
      security: "text-blue-600",
      data_collection: "text-orange-600",
    };
    return labelColors[label] || "text-gray-600";
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
        <p className="absolute top-6 left-4 font-brand text-ps-fo text-3xl mb-4">
            PrivyScan
        </p>
        <div className="flex flex-col max-w-lg items-center justify-center py-16">
            <p className="font-pecita text-ps-fo text-xl ">
            Your policy summary is ready
            </p>

            {/* Controlled carousel fallback */}
            {chunks.length > 0 && (
            <ControlledCarousel chunks={chunks} getGradeColor={getGradeColor} getLabelColor={getLabelColor} overallGrade={overallGrade} />
            )}

            {/* Fallback summary (old API format) */}
            {summary && chunks.length === 0 && (
            <div className="mt-6 w-full rounded-[28px] border-3 border-ps-yb bg-white/85 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                <p className="font-secondary text-ps-fo text-lg font-semibold mb-3">Summary</p>
                <p className="font-secondary text-ps-fo text-base leading-7 whitespace-pre-wrap">
                {summary}
                </p>
            </div>
            )}

            {/* Error state */}
            {analysisError && chunks.length === 0 && (
            <div className="mt-6 w-full rounded-[28px] border-3 border-ps-yb bg-white/85 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                <p className="font-secondary text-red-600 text-base leading-7">
                {analysisError}
                </p>
            </div>
            )}
        </div>
        <button onClick={(e) => navigate('/')} className="gap-2 text-ps-fo font-semibold text-lg cursor-pointer absolute bottom-6 left-4 flex items-center">
            <FaArrowLeft />Back to Home
        </button>
        <img
            src={grass}
            className="absolute bottom-0 right-0 w-fit h-fit object-cover"
        />
    </div>
  );
};

export default Results;

function ControlledCarousel({ chunks, getGradeColor, getLabelColor, overallGrade }) {
  const [index, setIndex] = useState(0);

  const prev = (e) => { e?.stopPropagation(); setIndex((i) => (i === 0 ? chunks.length - 1 : i - 1)); };
  const next = (e) => { e?.stopPropagation(); setIndex((i) => (i === chunks.length - 1 ? 0 : i + 1)); };

  const chunk = chunks[index];

  if (!chunk) return null;

  return (
    <div className="mt-8 max-w-2xl relative">
        <button type="button" onClick={prev} aria-label="Previous chunk" className="absolute -left-10 top-1/2 translate-y-1 bg-white/90 rounded-full p-2 shadow-md z-50"><FaChevronLeft /></button>
        <button type="button" onClick={next} aria-label="Next chunk" className="absolute -right-10 top-1/2 translate-y-1 bg-white/90 rounded-full p-2 shadow-md z-50"><FaChevronRight /></button>
        <div className="flex flex-row items-center justify-end gap-3 mb-4">
          <p className="font-secondary text-black font-semibold">Overall Grade</p>
          <div className={`w-12 h-12 rounded-full ${getGradeColor(overallGrade)} flex items-center justify-center text-white text-lg font-bold`}>
            {overallGrade}
          </div>
        </div>
        <div className="rounded-3xl border-3 border-ps-yb bg-white/90 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.12)] max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-secondary font-semibold text-gray-900">Chunk {chunk.chunk_id}/{chunks.length}</span>
            <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${getGradeColor(chunk.rating.grade)} flex items-center justify-center text-white font-bold text-sm`}>{chunk.rating.grade}</div>
                <span style={{ fontFamily: 'Kokoro' }} className={`font-semibold capitalize ${getLabelColor(chunk.rating.label)}`}>{chunk.rating.label}</span>
            </div>
        </div>

        <p className={`font-secondary text-xs font-semibold uppercase mb-3 ${getLabelColor(chunk.label)}`}>{chunk.label.replace(/_/g, " ")}</p>

        <p className="font-primary font-serif text-black text-sm leading-6 mb-4">{chunk.summary}</p>
      </div>
    </div>
  )
}
