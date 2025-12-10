import React from 'react';
import { BikeSection, VehicleType } from '../types';

interface BikeVisualProps {
  selectedSection: BikeSection | null;
  onSelectSection: (section: BikeSection | null) => void;
  vehicleType: VehicleType;
}

const BikeVisual: React.FC<BikeVisualProps> = ({ selectedSection, onSelectSection, vehicleType }) => {
  
  // Updated colors for Light Mode
  const getFill = (section: BikeSection) => {
    if (selectedSection === section) return "rgba(14, 165, 233, 0.3)"; // Sky 500 low opacity
    if (selectedSection === null) return "rgba(241, 245, 249, 0.8)"; // Slate 100
    return "rgba(226, 232, 240, 0.5)"; // Slate 200
  };

  const getStroke = (section: BikeSection) => {
    if (selectedSection === section) return "#0284c7"; // Sky 600
    return "#94a3b8"; // Slate 400
  };

  const getStrokeWidth = (section: BikeSection) => {
      return selectedSection === section ? "10" : "6";
  }

  const labels = {
    [BikeSection.Wheels]: "ဘီးများ",
    [BikeSection.Frame]: "ကိုယ်ထည်",
    [BikeSection.Cockpit]: "လက်ကိုင်",
    [BikeSection.Drivetrain]: vehicleType === 'motorbike' ? "အင်ဂျင်" : "မောင်းနှင်ပိုင်း",
  };

  // Darker text color for better visibility on light background (Slate 800)
  const textColor = "#1e293b"; 
  const textStroke = "#ffffff";
  const textStrokeWidth = "4px";

  return (
    <div className="relative w-full aspect-[16/9] max-h-[400px] flex items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full drop-shadow-lg"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <style>
            {`.label-text { font-family: 'Padauk', sans-serif; font-weight: 700; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
              .group:hover .label-text { opacity: 1; }
            `}
          </style>
        </defs>
        
        {vehicleType === 'bicycle' ? (
          <>
            {/* --- BICYCLE SVG --- */}
            
            {/* Wheels Section */}
            <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Wheels ? null : BikeSection.Wheels)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Wheels ? 0.4 : 1 }}
            >
              <circle cx="200" cy="350" r="110" fill={getFill(BikeSection.Wheels)} stroke={getStroke(BikeSection.Wheels)} strokeWidth={getStrokeWidth(BikeSection.Wheels)} />
              <circle cx="600" cy="350" r="110" fill={getFill(BikeSection.Wheels)} stroke={getStroke(BikeSection.Wheels)} strokeWidth={getStrokeWidth(BikeSection.Wheels)} />
              
              <g className="label-text">
                <text x="200" y="350" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Wheels]}</text>
                <text x="200" y="350" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Wheels]}</text>
                
                <text x="600" y="350" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Wheels]}</text>
                <text x="600" y="350" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Wheels]}</text>
              </g>
            </g>

            {/* Frame Section */}
            <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Frame ? null : BikeSection.Frame)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Frame ? 0.4 : 1 }}
            >
              <path d="M200 350 L380 150 L600 350 L420 350 L380 150" fill={getFill(BikeSection.Frame)} stroke={getStroke(BikeSection.Frame)} strokeWidth={getStrokeWidth(BikeSection.Frame)} strokeLinejoin="round"/>
              <path d="M380 150 L340 130" stroke={getStroke(BikeSection.Frame)} strokeWidth={getStrokeWidth(BikeSection.Frame)} strokeLinecap="round" />
              
              <g className="label-text">
                <text x="400" y="250" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Frame]}</text>
                <text x="400" y="250" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Frame]}</text>
              </g>
            </g>

            {/* Cockpit Section */}
            <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Cockpit ? null : BikeSection.Cockpit)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Cockpit ? 0.4 : 1 }}
            >
              <path d="M200 350 L160 100 L240 80" fill="transparent" stroke={getStroke(BikeSection.Cockpit)} strokeWidth={getStrokeWidth(BikeSection.Cockpit)} strokeLinecap="round" />
              <circle cx="160" cy="100" r="20" fill={getFill(BikeSection.Cockpit)} />
              
              <g className="label-text">
                <text x="160" y="70" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Cockpit]}</text>
                <text x="160" y="70" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Cockpit]}</text>
              </g>
            </g>

            {/* Drivetrain Section */}
            <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Drivetrain ? null : BikeSection.Drivetrain)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Drivetrain ? 0.4 : 1 }}
            >
              <circle cx="400" cy="350" r="40" fill={getFill(BikeSection.Drivetrain)} stroke={getStroke(BikeSection.Drivetrain)} strokeWidth={getStrokeWidth(BikeSection.Drivetrain)} />
              <path d="M400 350 L600 350" stroke={getStroke(BikeSection.Drivetrain)} strokeWidth={getStrokeWidth(BikeSection.Drivetrain)} strokeDasharray="10,5" />
              <circle cx="400" cy="350" r="15" fill="#e2e8f0" />
              
              <g className="label-text">
                <text x="400" y="420" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Drivetrain]}</text>
                <text x="400" y="420" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Drivetrain]}</text>
              </g>
            </g>
          </>
        ) : (
          <>
            {/* --- MOTORBIKE SVG --- */}

            {/* Wheels */}
            <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Wheels ? null : BikeSection.Wheels)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Wheels ? 0.4 : 1 }}
            >
               <circle cx="200" cy="350" r="90" fill={getFill(BikeSection.Wheels)} stroke={getStroke(BikeSection.Wheels)} strokeWidth={getStrokeWidth(BikeSection.Wheels)} />
               <circle cx="600" cy="350" r="90" fill={getFill(BikeSection.Wheels)} stroke={getStroke(BikeSection.Wheels)} strokeWidth={getStrokeWidth(BikeSection.Wheels)} />
               
               <g className="label-text">
                 <text x="200" y="350" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Wheels]}</text>
                 <text x="200" y="350" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Wheels]}</text>
                 <text x="600" y="350" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Wheels]}</text>
                 <text x="600" y="350" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Wheels]}</text>
               </g>
            </g>

            {/* Engine / Drivetrain */}
            <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Drivetrain ? null : BikeSection.Drivetrain)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Drivetrain ? 0.4 : 1 }}
            >
              <path d="M350 350 L450 350 L470 280 L330 280 Z" fill={getFill(BikeSection.Drivetrain)} stroke={getStroke(BikeSection.Drivetrain)} strokeWidth={getStrokeWidth(BikeSection.Drivetrain)} strokeLinejoin="round" />
              <path d="M460 320 L650 300" stroke={getStroke(BikeSection.Drivetrain)} strokeWidth={getStrokeWidth(BikeSection.Drivetrain)} strokeLinecap="round" /> {/* Exhaust */}
              
              <g className="label-text">
                <text x="400" y="330" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Drivetrain]}</text>
                <text x="400" y="330" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Drivetrain]}</text>
              </g>
            </g>

            {/* Frame / Body */}
             <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Frame ? null : BikeSection.Frame)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Frame ? 0.4 : 1 }}
            >
              <path d="M200 350 L280 150 L500 150 L550 250 L470 280 L330 280 L250 350" fill="transparent" stroke={getStroke(BikeSection.Frame)} strokeWidth={getStrokeWidth(BikeSection.Frame)} strokeLinejoin="round"/>
              <path d="M320 150 L450 150 L500 200 L320 200 Z" fill={getFill(BikeSection.Frame)} /> {/* Tank/Seat */}
              
              <g className="label-text">
                <text x="400" y="180" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Frame]}</text>
                <text x="400" y="180" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Frame]}</text>
              </g>
            </g>

            {/* Cockpit / Handlebars */}
            <g 
              onClick={() => onSelectSection(selectedSection === BikeSection.Cockpit ? null : BikeSection.Cockpit)}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              style={{ opacity: selectedSection && selectedSection !== BikeSection.Cockpit ? 0.4 : 1 }}
            >
              <path d="M200 350 L250 150 L220 100" stroke={getStroke(BikeSection.Cockpit)} strokeWidth={getStrokeWidth(BikeSection.Cockpit)} strokeLinecap="round"/>
              <circle cx="250" cy="150" r="15" fill={getFill(BikeSection.Cockpit)} />
              <path d="M220 100 L280 100" stroke={getStroke(BikeSection.Cockpit)} strokeWidth={getStrokeWidth(BikeSection.Cockpit)} strokeLinecap="round"/>
              
              <g className="label-text">
                <text x="250" y="80" textAnchor="middle" stroke={textStroke} strokeWidth={textStrokeWidth} className="text-lg">{labels[BikeSection.Cockpit]}</text>
                <text x="250" y="80" textAnchor="middle" fill={textColor} className="text-lg">{labels[BikeSection.Cockpit]}</text>
              </g>
            </g>
          </>
        )}

      </svg>
      
      {/* Legend / Overlay Text */}
      <div className="absolute top-4 left-4 text-xs font-mono text-slate-500 bg-white/70 backdrop-blur rounded p-1">
        အစိတ်အပိုင်းများကို<br/>
        ရွေးချယ်ကြည့်ရှုရန်
      </div>

      {selectedSection && (
        <div className="absolute bottom-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
          {labels[selectedSection]}
        </div>
      )}
    </div>
  );
};

export default BikeVisual;