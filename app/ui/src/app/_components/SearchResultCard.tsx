import Link from "next/link";
import type { FlaskUniversityDocument } from "~/server/api/routers/universities";

type SearchResultCardProps = {
  university: FlaskUniversityDocument;
  onRelevanceChange: (id: string) => void;
  isRelevant: boolean;
};

const SearchResultCard = (props: SearchResultCardProps) => {
  return (
    <Link href={props.university.url ?? "#"} target="_blank">
      <div className="relative flex w-full flex-col gap-2 rounded-lg border bg-black/40 p-5">
        <div className="flex justify-between align-top">
          <h3 className="text-lg font-bold">
            {props.university.institution_name}
          </h3>
          <button
            type="button"
            className="h-fit w-fit rounded bg-purple-700 px-4 py-2 text-sm text-white hover:bg-purple-800"
          >
            Open
          </button>
        </div>

        <p className="text-sm font-semibold">
          {props.university.country}, {props.university.city_name}{" "}
        </p>

        {props.university.highlights?.length === 0 ? (
          <p className="text-sm">{props.university.wikipedia_text}</p>
        ) : (
          props.university.highlights?.map((x, idx) => {
            return (
              <div className="flex flex-wrap text-sm" key={`highlight-${idx}`}>
                <span>...</span>
                <div
                  className="inline"
                  dangerouslySetInnerHTML={{ __html: x }}
                ></div>
                <span>...</span>
              </div>
            );
          })
        )}

        {/* Relevance Section */}
        <div className="absolute bottom-0 right-0 flex items-center gap-4 p-5">
          <label className="text-sm font-bold text-white">Relevance</label>
          <input
            type="checkbox"
            checked={props.isRelevant}
            onChange={() => props.onRelevanceChange(props.university.id)}
            className="h-4 w-4 text-purple-700"
          />
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
