import MovieDetails from "@/components/MovieDetails/MovieDetails";
import NowInCinema from "@/components/NowInCinema/NowInCinema";
import React from "react";

const InCinemaPage = () => {
    return (
        <div className="py-4 px-5 flex flex-col min-h-screen">
            <NowInCinema />
            <div className="mt-40">
                <MovieDetails />
            </div>
        </div>
    );
};

export default InCinemaPage;
