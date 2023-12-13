import {useEffect, useState} from "react";
import type {FlaskUniversityDocument} from "~/server/api/routers/universities";


type SearchResultCardProps = {
  university: FlaskUniversityDocument;
  onRelevanceChange: (id: string) => void;
  isRelevant: boolean;
};

const SearchResultCard = (props: SearchResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getAgeImage = () => {
    const ageMap: { [key: string]: string } = {
      historic: "/age_5.png",
      mature: "/age_4.png",
      established: "/age_3.png",
      young: "/age_2.png",
      new: "/age_1.png",
    };

     // Provide a default image if age is not recognized
    return ageMap[props.university.age];
  };

  const getSizeImage = () => {
    const ageMap: { [key: string]: string } = {
      "extra large": "/size_5.png",
      large: "/size_4.png",
      medium: "/size_2.png",
      small: "/size_1.png",
    };

    return ageMap[props.university.size] ?? "/size_5.png";
  };

  const getStaticMapImageUrl = (coordinates: string, zoom = 15, size = "300x300") => {
    return `https://maps.openstreetmap.org/?mlat=${coordinates.split(',')[1]}&mlon=${coordinates.split(',')[0]}#${zoom}/${coordinates.split(',')[1]}/${coordinates.split(',')[0]}`;
  };

  const handleOpenClick = () => {
    window.open(props.university.url, "_blank");
  }

  return (
      <div className={`relative flex w-full flex-col gap-2 rounded-lg border bg-black/40 p-5 ${isExpanded ? "h-[400px]" : "h-[140px] overflow-hidden"}`}>
        <div className="flex justify-between align-top cursor-pointer">
          <h3 className="text-lg font-bold">{props.university.institution_name}</h3>
          {/* Relevance Section */}
          <div className="absolute top-2 right-32 flex items-center gap-4 p-5">
            <label className="text-sm font-bold text-white">Relevance</label>
            <input type="checkbox" checked={props.isRelevant} onChange={() => props.onRelevanceChange(props.university.id)} className="h-4 w-4 text-purple-700" />
          </div>
          <button type="button" className="h-fit w-fit rounded bg-purple-700 px-4 py-2 text-sm text-white hover:bg-purple-800" onClick={handleCardClick}>
            Expand
          </button>
          <button type="button" className="h-fit w-fit rounded bg-purple-700 px-4 py-2 text-sm text-white hover:bg-purple-800" onClick={handleOpenClick}>
            Open
          </button>
        </div>

        <p className="text-sm font-semibold">{props.university.country}, {props.university.city_name}</p>

        {props.university.highlights?.length === 0 ? (
            <p className="text-sm">{props.university.wikipedia_text}</p>
        ) : (
            props.university.highlights?.map((x, idx) => (
                <div className="flex flex-wrap text-sm" key={`highlight-${idx}`}>
                  <span>...</span>
                  <div className="inline" dangerouslySetInnerHTML={{ __html: x }}></div>
                  <span>...</span>
                </div>
            ))
        )}

        {/* Age Section */}
        {isExpanded && (
            <div className="flex items-center gap-4 p-5">
              <label className="text-sm font-bold text-white">Age</label>
              <img src={getAgeImage() as string} alt={props.university.age} className="h-20 w-20" />
            </div>
        )}

        {/* Size Section */}
        {isExpanded && (
            <div className="flex items-center gap-4 p-5">
              <label className="text-sm font-bold text-white">Size</label>
              <img src={getSizeImage() as string} alt={props.university.size} className="h-20 w-20" />
            </div>
        )}

        {/* Map Section<div className="flex items-center gap-4 p-5">
                <label className="text-sm font-bold text-white">Map</label>
                <img src={getStaticMapImageUrl(props.university.coordinates || "0,0")} alt="University Map" className="h-40 w-40" />
              </div>
                </div> */ }
      </div>
  );
};

export default SearchResultCard;
