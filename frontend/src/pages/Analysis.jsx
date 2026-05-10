import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import grass from "../assets/grass.png";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HF_ANALYZE_API_URL = "https://projectextraction69-privyscan-api.hf.space/analyze";

const stages = [
  { id: 1, name: "Fetching website text" },
  { id: 2, name: "Analyzing policies" },
];

const Analysis = () => {
  const location = useLocation();
    const navigate = useNavigate();
  const pageUrl = location.state?.pageUrl ?? "";

  const [displayedStage, setDisplayedStage] = useState(0); // index into stages[]
  const [stageComplete, setStageComplete] = useState(false); // triggers checkmark on current stage

  const [summary, setSummary] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Shows checkmark on current stage, then advances to next
  const advanceStage = () => {
    return new Promise((resolve) => {
      setStageComplete(true);
      setTimeout(() => {
        setStageComplete(false);
        setDisplayedStage((prev) => prev + 1);
        resolve();
      }, 800);
    });
  };

  const getAnalysis = async () => {
    try {
      if (!pageUrl) throw new Error("No URL was provided for analysis.");

      setIsAnalyzing(true);
      setAnalysisError("");

      const scrapeResponse = await fetch(`${VITE_API_BASE_URL}/scrape-policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pageUrl }),
      });

      if (!scrapeResponse.ok) {
        throw new Error(`Scrape request failed with status ${scrapeResponse.status}`);
      }

      const scrapeData = await scrapeResponse.json();
      const policyText = scrapeData?.policy_text?.trim();

      if (!policyText) throw new Error("No policy text was returned from the scrape step.");

      // Stage 1 done → show checkmark, then switch to stage 2
      await advanceStage();

      // ── Stage 2: Analyze ─────────────────────────────────────────
      const analyzeResponse = await fetch(HF_ANALYZE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: scrapeData?.url ?? pageUrl,
          text: policyText,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error(`Analyze request failed with status ${analyzeResponse.status}`);
      }

      const analyzeData = await analyzeResponse.json();

      if (analyzeData?.overall_grade && analyzeData?.chunks) {
        setSummary("");
      } else {
        const summaryText =
          analyzeData?.summary ??
          analyzeData?.summary_text ??
          analyzeData?.result ??
          analyzeData?.analysis ??
          analyzeData?.output ??
          (typeof analyzeData === "string"
            ? analyzeData
            : JSON.stringify(analyzeData, null, 2));
        setSummary(summaryText);
      }

      // Stage 2 done → show checkmark briefly, then hide loader
      setStageComplete(true);
      setTimeout(() => {
         setIsAnalyzing(false);
         // Navigate to Results after analysis completes
         setTimeout(() => {
           navigate("/results", {
             state: {
              overallGrade: analyzeData?.overall_grade || "",
              chunks: analyzeData?.chunks || [],
              summary: analyzeData?.summary || "",
               pageUrl: pageUrl,
             },
           });
         }, 500);
      }, 800);
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the policy."
      );
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    getAnalysis();
  }, []);



  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <p className="absolute top-4 sm:top-6 left-4 font-brand text-ps-fo text-2xl sm:text-3xl mb-4">
        PrivyScan
      </p>

      <div className="flex flex-col w-full max-w-[550px] items-center justify-center py-16 px-4 sm:px-0">
        <p className="font-pecita text-ps-fo text-base sm:text-xl mb-4 text-center">
          {isAnalyzing
            ? "Give us a moment- we are analyzing this for you"
            : "Your policy summary is ready"}
        </p>

        {/* Loader bar — shown while analyzing (cap displayedStage to last index) */}
        {isAnalyzing && (
          <div className="bg-gradient-to-r from-ps-yb to-[#6CABE5] border-3 border-ps-yb p-2 sm:p-3 rounded-full overflow-hidden w-full">
            <div className="flex items-center justify-between gap-3">
              <p className="font-secondary font-semibold text-white text-sm sm:text-xl">
                {stages[Math.min(displayedStage, stages.length - 1)]?.name}
              </p>
              <Loader isComplete={stageComplete} />
            </div>
          </div>
        )}
      </div>

      <img
        src={grass}
        className="absolute bottom-0 right-0 w-fit h-fit object-cover"
      />
    </div>
  );
};

export default Analysis;