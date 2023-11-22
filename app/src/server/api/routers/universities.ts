import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createClient } from "solr-client";

// Define TS University document schema
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

// instanciate Solr connection
const solrClient = createClient({
  core: "universities",
  port: 8983,
  path: "localhost",
});

export const universitiesRouter = createTRPCRouter({
  // Example Solr query builder
  testSolr: publicProcedure
    .input(z.object({ input: z.string().min(1) }))
    .mutation(async () => {
      try {
        const solrQuery = solrClient.query().q("Some query");
        const data = await solrClient.search<UniversityDocument>(solrQuery);

        return {
          data: data,
        };
      } catch (err) {
        console.log("Error while executing universities.testSolr query.", err);
        throw new Error("SOLR_NOT_RUNNING");
      }
    }),

  search: publicProcedure
    .input(z.object({ input: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { message: input };
    }),
});
