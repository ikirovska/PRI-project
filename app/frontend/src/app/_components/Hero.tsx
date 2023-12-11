"use client";

import React, { type FormEvent, useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import ErrorMessage from "./ErrorMessage";
import type { FlaskUniversityDocument } from "~/server/api/routers/universities";
import { PulseLoader as Loader } from "react-spinners";
import SearchResultCard from "./SearchResultCard";

const Hero = () => {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState<FlaskUniversityDocument[]>([]);

  const searchMutation = api.universities.search.useMutation({
    onError: (err) => {
      switch (err.message) {
        case "SOLR_NOT_RUNNING": {
          setErrorMessage("Solr is not running.");
          break;
        }
        case "INCORRECT_QUERY": {
          setErrorMessage("Cannot execute this query.");
          break;
        }
        default: {
          setErrorMessage("Unexpected error happened. Please try again.");
          break;
        }
      }
    },
    onSuccess: (data) => {
      setResults((prev) => [...prev, ...data.data.results]);
      setErrorMessage(undefined);
    },
  });

  const noMoreResults =
    searchMutation.data?.data.num_found !== undefined &&
    searchMutation.data?.data.num_found === results.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResults([]);
    searchMutation.mutate({ input: input, limit: limit, offset: offset });
  };

  const handleLoadMore = () => {
    searchMutation.mutate({
      input: input,
      limit: limit,
      offset: offset + limit,
    });

    setOffset((prev) => prev + limit);
  };

  return (
    <>
      <div className="absolute left-0 top-0 z-0 h-screen w-full object-cover">
        <Image
          className="z-0 object-cover"
          fill={true}
          src={"/hero-bg.jpg"}
          alt="University building"
          priority={true}
        />
        <div className="absolute left-0 top-0 z-10 h-full w-full bg-black/75"></div>
      </div>

      <div className="container z-20 flex w-full max-w-6xl flex-col items-center justify-center gap-12 px-4 py-40">
        <h1 className="text-center text-4xl font-bold leading-tight md:mb-10 md:text-6xl md:leading-snug">
          European{" "}
          <span className="text-purple-400 underline underline-offset-8">
            universities search{" "}
          </span>{" "}
          engine
        </h1>

        <form
          className="flex w-full flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full max-w-2xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              id="Search"
              placeholder="Type in anything to find a university..."
              className="w-full rounded-md border-gray-200 px-4 py-3 pe-10 text-gray-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500"
              name="searchInput"
            />
            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
              <button
                type="submit"
                className="text-gray-600 outline-none hover:text-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                <span className="sr-only">Search</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </span>
          </div>
        </form>

        {(searchMutation.isSuccess ||
          searchMutation.isError ||
          searchMutation.isLoading) && (
          <div className="min-h-[300px] w-full rounded border border-gray-400 bg-gray-700/70 p-4">
            <h2 className="mb-6 text-xl font-medium">Results</h2>

            {errorMessage && (
              <div className="mx-auto w-full max-w-md">
                <ErrorMessage
                  title="Something went wrong"
                  message={errorMessage}
                />
              </div>
            )}

            <div className="flex w-full flex-col gap-4">
              {searchMutation.isSuccess && results.length === 0 && (
                <p className="text-center">No results found</p>
              )}

              {results.map((x, idx) => {
                return <SearchResultCard key={idx} university={x} />;
              })}
            </div>

            {searchMutation.isLoading && (
              <div className="mx-auto my-12 w-fit">
                <Loader color="white" />
              </div>
            )}

            {searchMutation.isSuccess &&
              !(searchMutation.isSuccess && results.length === 0) &&
              !noMoreResults && (
                <div className="mt-12 flex w-full justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="mx-auto rounded bg-purple-700 px-8 py-3 text-white hover:bg-purple-800"
                  >
                    Load more results
                  </button>
                </div>
              )}

            {searchMutation.isSuccess && noMoreResults && (
              <p className="text-center">No more results.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;