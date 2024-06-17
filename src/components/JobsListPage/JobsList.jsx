import { Navbar } from "../navbar";
import { Footer } from "../footer";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { JobCard } from "./JobCard";
import SearchRight from "../Search_right";

const Cont = styled.div`
    background-color: white;
    width: 85%;
    border-radius: 5px;
    margin: 20px auto;
    & > div {
        display: flex;
        & > div:nth-of-type(1) {
            height: 600px;
            width: 35%;
            border: 1px solid #d4d4d4;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: auto;
        }
        & > div:nth-of-type(2) {
            height: 600px;
            overflow-y: auto;
            overflow-x: hidden;
            width: 65%;
        }
    }
`;

const InnerNav = styled.div`
    background-color: white;
    display: flex;
    height: 70px;
    align-items: center;
    select {
        height: 40px;
        border: 1px solid #cecece;
        width: 180px;
        font-size: 17px;
        color: gray;
        margin: 0 7px;
    }
`;

export function JobsList({ location }) {
    const query = location.state?.query || "";
    const [list, setList] = useState([]);
    const [rightShowIndex, setRightShowIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobListings = async () => {
            try {
                let url = new URL('https://glassdoor-backend.vercel.app/api/jobs/getAlljobs');
                let params = {};

                // Adding query parameters if available
                if (query) params.company = query;

                // Construct the URL with query parameters
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setList(data.jobs);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching job listings: ", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchJobListings();
    }, [query]);

    const handleClick = (index) => {
        setRightShowIndex(index);
    };

    return (
        <>
            <Navbar />
            <Cont>
                <InnerNav>
                    {/* Your InnerNav JSX */}
                </InnerNav>
                <div>
                    <div>
                        {loading ? (
                            <div>Loading...</div>
                        ) : error ? (
                            <div>Error fetching job listings: {error.message}</div>
                        ) : list.length > 0 ? (
                            list.map((elem, index) => (
                                <JobCard {...elem} key={index} handleClick={() => handleClick(index)} />
                            ))
                        ) : (
                            <div>No job listings found.</div>
                        )}
                    </div>
                    <div>
                        <SearchRight {...list[rightShowIndex]} btnStatus={"Easy Apply"} />
                    </div>
                </div>
            </Cont>
            <Footer />
        </>
    );
}
