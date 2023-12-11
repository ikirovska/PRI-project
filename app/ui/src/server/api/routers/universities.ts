import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const backendUrl = process.env.BACKEND_DOCKER_URL ?? "http://localhost:5000";

// Define TS University document schema
// ? Not needed anymore
type UniversityDocument = {
  "2024_rank": string;
  "2023_rank": string;
  "institution_name_-_wrong": string;
  institution_name: string;
  country_code: string;
  country: string;
  size: string;
  focus: string;
  age: string;
  status: string;
  academic_reputation_score: string;
  academic_reputation_rank: string;
  employer_reputation_score: string;
  employer_reputation_rank: string;
  faculty_student_score: string;
  faculty_student_rank: string;
  citations_per_faculty_score: string;
  citations_per_faculty_rank: string;
  international_students_score: string;
  international_students_rank: string;
  international_research_network_score: string;
  international_research_network_rank: string;
  employment_outcomes_score: string;
  employment_outcomes_rank: string;
  overall_score: string;
  wikidata: string;
  wikipedia_text: string;
  city_wikipedia_text: string;
  coordinates: unknown;
};

export type FlaskUniversityDocument = {
  institution_name: string;
  url: string;
  wikipedia_text: string;
  country: string;
  highlights: string[];
  city_name: string;
};

type FlaskResponse = {
  results: FlaskUniversityDocument[];
  status: "OK" | "ERROR";
};

export const universitiesRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        input: z.string().min(1),
        limit: z.number(),
        offset: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const queryUrl =
          backendUrl +
          `/semantic-query?search=${input.input}&limit=${input.limit}&offset=${input.offset}`;
        const finalQueryUrl = encodeURI(queryUrl);

        console.log("QQ", finalQueryUrl);

        const res = await fetch(finalQueryUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = (await res.json()) as FlaskResponse;

        return {
          data: data,
        };
      } catch (err) {
        console.log("Error while executing universities.testSolr query.", err);
        throw new Error("SOLR_NOT_RUNNING");
      }
    }),
});
