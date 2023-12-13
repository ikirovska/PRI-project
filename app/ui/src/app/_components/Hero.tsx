"use client";

import React, { type FormEvent, useMemo, useState } from "react";
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
  const [queryVector, setQueryVector] = useState<number[] | undefined>(
    undefined,
  );

  console.log(results);

  let pseudoRelevanceFeedback: boolean;

  const ageFilterOptions = [
    "historic",
    "mature",
    "established",
    "young",
    "new",
  ];
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const sizeFilterOptions = ["small", "medium", "large"];
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const rankFilterOptions = ["<250", "250-500", ">500"];
  const [selectedRankFilter, setSelectedRankFilter] = useState<string | null>(
    null,
  );

  const selectedRelevantCount = results.reduce((acc, val) => {
    const found = val.isRelevant ? 1 : 0;
    return (acc += found);
  }, 0);

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
      setResults((prev) => [
        ...prev,
        ...data.data.results.map((result) => ({
          ...result,
          isRelevant: false, // Set the initial value based on your requirements
        })),
      ]);
      setQueryVector(data.data.query_vector);
      setErrorMessage(undefined);

      if (pseudoRelevanceFeedback) {
        // Pseudo Relevance feedback algorithm (N=3)
        // Make the first 3 results relevant
        const new_results = results.slice(0, 3).map((result) => ({
          ...result,
          isRelevant: true,
        }));

        const queryVector = relevanceFeedback(new_results);

        setResults([]);
        setOffset(0);
        setQueryVector(queryVector);

        searchMutation.mutate({
          input: input,
          limit: limit,
          offset: offset,
          vector: queryVector,
        });

        pseudoRelevanceFeedback = false;
      }
    },
  });

  const noMoreResults =
    searchMutation.data?.data.num_found !== undefined &&
    searchMutation.data?.data.num_found === results.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResults([]);
    setOffset(0);
    setQueryVector(undefined);
    pseudoRelevanceFeedback = true;
    searchMutation.mutate({ input: input, limit: limit, offset: 0 });
  };

  const handleLoadMore = () => {
    console.log("TQP", typeof queryVector);

    searchMutation.mutate({
      input: input,
      limit: limit,
      offset: offset + limit,
      vector: queryVector,
    });

    setOffset((prev) => prev + limit);
  };

  function relevanceFeedback(results_to_filter: FlaskUniversityDocument[]) {
    // Relevance feedback algorithm
    // Filter out the relevant and non-relevant documents
    const relevantDocs = results_to_filter.filter(
      (result) => result.isRelevant,
    );
    const nonRelevantDocs = results_to_filter.filter(
      (result) => !result.isRelevant,
    );

    const alpha = 1.0;
    const beta = 0.75;
    const gamma = 0.15;

    let newQueryVector = searchMutation.data?.data.query_vector ?? [];

    // Use Rocchio algorithm to update the query vector
    relevantDocs.forEach((doc) => {
      console.log("DOC", doc);
      newQueryVector = newQueryVector.map((value: number, idx: number) => {
        return value + alpha * (doc.university_vector[idx] ?? 0);
      });
    });

    nonRelevantDocs.forEach((doc) => {
      newQueryVector = newQueryVector.map((value: number, idx: number) => {
        return value - beta * (doc.university_vector[idx] ?? 0);
      });
    });

    results.forEach((doc) => {
      newQueryVector = newQueryVector.map((value: number, idx: number) => {
        return value - gamma * (doc.university_vector[idx] ?? 0);
      });
    });

    // Normalize the query vector
    const norm = Math.sqrt(
      newQueryVector.reduce((acc: number, val: number) => acc + val ** 2, 0),
    );
    newQueryVector = newQueryVector.map((value: number) => value / norm);

    console.log("Updated Query Vector: ", newQueryVector);

    return newQueryVector;
  }

  const handleRelevanceSubmit = () => {
    // Print the count to the console
    console.log("Selected Relevant Count: ", selectedRelevantCount);

    const newQueryVector = relevanceFeedback(results);

    setResults([]);
    setOffset(0);
    setQueryVector(newQueryVector);

    searchMutation.mutate({
      input: input,
      limit: limit,
      offset: offset,
      vector: newQueryVector,
    });
  };

  const handleRelevanceChange = (id: string) => {
    const newResults = results.map((x) => {
      if (x.id === id) {
        return {
          ...x,
          isRelevant: !x.isRelevant,
        };
      }
      return x;
    });

    setResults(newResults);
  };

  const handleAgeFilterToggle = (ageType: string) => {
    const isSelected = selectedAges.includes(ageType);
    if (isSelected) {
      setSelectedAges((prev) => prev.filter((age) => age !== ageType));
    } else {
      setSelectedAges((prev) => [...prev, ageType]);
    }
  };

  const handleSizeFilterToggle = (sizeType: string) => {
    const isSelected = selectedSizes.includes(sizeType);
    if (isSelected) {
      setSelectedSizes((prev) => prev.filter((size) => size !== sizeType));
    } else {
      setSelectedSizes((prev) => [...prev, sizeType]);
    }
  };

  const handleRankFilterChange = (rankType: string) => {
    setSelectedRankFilter(rankType === selectedRankFilter ? null : rankType);
  };

  const filteredResults = useMemo(() => {
    let rankFilteredResults = results;

    // Apply rank filter
    if (selectedRankFilter) {
      let minRank: number | undefined;
      let maxRank: number | undefined;

      if (selectedRankFilter === "<250") {
        minRank = 0;
        maxRank = 250;
      } else if (selectedRankFilter === "250-500") {
        minRank = 250;
        maxRank = 500;
      } else if (selectedRankFilter === ">500") {
        minRank = 500;
        maxRank = 10000;
      }

      rankFilteredResults = rankFilteredResults.filter((result) =>
        minRank && maxRank
          ? result.rank_2024 > minRank && result.rank_2024 <= maxRank
          : true,
      );
    }

    // Apply other filters (age, size)
    if (selectedSizes.length > 0) {
      rankFilteredResults = rankFilteredResults.filter((result) =>
        selectedSizes.includes(result.size),
      );
    }

    if (selectedAges.length > 0) {
      rankFilteredResults = rankFilteredResults.filter((result) =>
        selectedAges.includes(result.age),
      );
    }

    return rankFilteredResults;
  }, [results, selectedAges, selectedSizes, selectedRankFilter]);

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

          {/* Age Filter */}
          {searchMutation.isSuccess && (
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-bold text-white">
                Filter by Age:
              </label>
              {ageFilterOptions.map((ageType) => (
                <div key={ageType} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAges.includes(ageType)}
                    onChange={() => handleAgeFilterToggle(ageType)}
                    className="h-4 w-4 text-purple-700"
                  />
                  <span className="text-sm text-white">{ageType}</span>
                </div>
              ))}
            </div>
          )}

          {/* Size Filter */}
          {searchMutation.isSuccess && (
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-bold text-white">
                Filter by Size:
              </label>
              {sizeFilterOptions.map((sizeType) => (
                <div key={sizeType} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(sizeType)}
                    onChange={() => handleSizeFilterToggle(sizeType)}
                    className="h-4 w-4 text-purple-700"
                  />
                  <span className="text-sm text-white">{sizeType}</span>
                </div>
              ))}
            </div>
          )}

          {/* Rank Filter */}
          {searchMutation.isSuccess && (
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-bold text-white">
                Filter by Rank:
              </label>
              {rankFilterOptions.map((rankType) => (
                <div key={rankType} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`rank-${rankType}`}
                    checked={rankType === selectedRankFilter}
                    onChange={() => handleRankFilterChange(rankType)}
                    className="h-4 w-4 text-purple-700"
                  />
                  <label
                    htmlFor={`rank-${rankType}`}
                    className="text-sm text-white"
                  >
                    {rankType}
                  </label>
                </div>
              ))}
            </div>
          )}
        </form>

        {(searchMutation.isSuccess ||
          searchMutation.isError ||
          searchMutation.isLoading) && (
          <div className="min-h-[300px] w-full rounded border border-gray-400 bg-gray-700/70 p-4">
            <div className="mb-6 flex w-full justify-between">
              <h2 className="text-xl font-medium">Results</h2>

              <button
                type="button"
                onClick={handleRelevanceSubmit}
                className="rounded bg-purple-700 px-4 py-2 text-white hover:bg-purple-800"
              >
                Submit Relevance - {selectedRelevantCount}/{results.length}
              </button>
            </div>

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

              {filteredResults.map((x, idx) => (
                <SearchResultCard
                  key={idx}
                  university={x}
                  isRelevant={x.isRelevant}
                  onRelevanceChange={handleRelevanceChange}
                />
              ))}
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
