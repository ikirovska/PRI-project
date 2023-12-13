"use client";

import { useState } from "react";
import type { FlaskUniversityDocument } from "~/server/api/routers/universities";
import dynamic from "next/dynamic";
import Link from "next/link";

const DynamicMap = dynamic(() => import("./Map"), {
  loading: () => <p>Loading...</p>,
});

type SearchResultCardProps = {
  university: FlaskUniversityDocument;
  onRelevanceChange: (id: string) => void;
  isRelevant: boolean;
};

const SearchResultCard = (props: SearchResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const coordinates_str = props.university.coordinates.split(",");
  const coordinates = [
    parseFloat(coordinates_str[0] ?? "0"),
    parseFloat(coordinates_str[1] ?? "0"),
  ];

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getAgeImage = () => {
    const ageMap: Record<string, string> = {
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
    const sizeMap: Record<string, string> = {
      "extra large": "/size_5.png",
      large: "/size_4.png",
      medium: "/size_2.png",
      small: "/size_1.png",
    };

    return sizeMap[props.university.size] ?? "/size_5.png";
  };

  console.log(props.university.rank_2024);

  return (
    <div
      className={`relative flex w-full flex-col gap-2 rounded-lg border bg-black/40 p-5 ${
        isExpanded ? "min-h-[400px]" : "h-[140px] overflow-hidden"
      }`}
    >
      <div className="flex cursor-pointer justify-between align-top">
        <h3 className="text-lg font-bold">
          {props.university.institution_name}
        </h3>

        <div className="flex justify-center gap-3">
          {/* Relevance Section */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-white">Relevance</label>
            <input
              type="checkbox"
              checked={props.isRelevant}
              onChange={() => props.onRelevanceChange(props.university.id)}
              className="h-4 w-4 text-purple-700"
            />
          </div>
          <button
            type="button"
            className="h-fit w-fit rounded bg-purple-700 px-4 py-2 text-sm text-white hover:bg-purple-800"
            onClick={handleCardClick}
          >
            Expand
          </button>
          <Link href={props.university.url} target="_blank">
            <button
              type="button"
              className="h-fit w-fit rounded bg-purple-700 px-4 py-2 text-sm text-white hover:bg-purple-800"
            >
              Open document
            </button>
          </Link>
        </div>
      </div>

      <p className="text-sm font-semibold">
        {props.university.country}, {props.university.city_name}
      </p>

      {props.university.highlights?.length === 0 ? (
        <p className="text-sm">{props.university.wikipedia_text}</p>
      ) : (
        props.university.highlights?.map((x, idx) => (
          <div className="flex flex-wrap text-sm" key={`highlight-${idx}`}>
            <span>...</span>
            <div
              className="inline"
              dangerouslySetInnerHTML={{ __html: x }}
            ></div>
            <span>...</span>
          </div>
        ))
      )}

      {isExpanded && (
        <div className="mt-8 flex w-full justify-between gap-12">
          <div className="flex flex-col gap-6">
            {/* Age Section */}
            <div className="flex flex-col items-center justify-center">
              <label className="text-sm font-bold text-white">Age</label>

              <div className="relative h-20 w-20 object-cover">
                <img
                  src={getAgeImage() ?? "#"}
                  alt={props.university.age}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="text-sm font-bold text-white">Size</label>

              <div className="relative flex h-20 w-20 items-center justify-center object-cover">
                <img
                  src={getSizeImage() ?? "#"}
                  alt={props.university.size}
                  className="object-cover"
                />
              </div>
            </div>

            <p>2024 Rank: {props.university.rank_2024}</p>
          </div>

          <div className="relative h-80 w-full bg-red-200">
            <DynamicMap
              tooltip={props.university.institution_name}
              position={coordinates as [number, number]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultCard;
