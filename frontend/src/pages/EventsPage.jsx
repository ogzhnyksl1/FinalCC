import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents, clearError } from "../slices/eventSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import EventCard from "../components/EventCard";
import '../styles/EventsPage.css';

const EventsPage = () => {
  const [filter, setFilter] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);
  
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { userInfo } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);
  
  useEffect(() => {
    if (events) {
      if (filter === "all") {
        setFilteredEvents(events);
      } else if (filter === "upcoming") {
        setFilteredEvents(
          events.filter((event) => new Date(event.date) > new Date())
        );
      } else if (filter === "past") {
        setFilteredEvents(
          events.filter((event) => new Date(event.date) < new Date())
        );
      } else if (filter === "registered") {
        setFilteredEvents(
          events.filter((event) =>
            event.attendees.some((attendee) => attendee === userInfo._id)
          )
        );
      }
    }
  }, [events, filter, userInfo]);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Bar */}
      <div className="bg-lime-400 py-3 px-4">
        <div className="container mx-auto flex items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 mr-2">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3.6C17.0609 3.6 16.1282 3.90714 15.3333 4.47771C14.5384 5.04828 13.9193 5.85362 13.5605 6.7868C13.2018 7.71997 13.1191 8.73942 13.324 9.72586C13.5289 10.7123 14.0113 11.6163 14.7087 12.3137C15.4062 13.0112 16.3102 13.4935 17.2966 13.6984C18.283 13.9033 19.3025 13.8207 20.2357 13.4619C21.1688 13.1032 21.9742 12.4841 22.5448 11.6891C23.1153 10.8942 23.4225 9.96148 23.4225 9.0225C23.4225 7.74533 22.9135 6.52091 22.0088 5.61618C21.1041 4.71146 19.8796 4.2025 18.6025 4.2025M18 3.6V4.2025V3.6ZM18 3.6C14.4525 3.6 10.9199 4.4829 7.79978 6.14816C4.67962 7.81342 2.09066 10.2015 0.26648 13.101C-1.5577 15.9005 -1.54498 19.0495 0.297867 21.8384C2.14071 24.6274 4.74522 26.9994 7.875 28.6494C11.0048 30.2993 14.5425 31.1645 18.09 31.1458C21.6375 31.1271 25.1652 30.2254 28.2752 28.5432C31.3853 26.861 33.9614 24.4635 35.7726 21.5617C37.5837 18.6599 37.5576 15.5109 35.7016 12.7308" stroke="white" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white">Connect</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-5 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
            <h1 className="text-xl font-semibold text-lime-500 mb-4 md:mb-0">Events</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              {userInfo && (userInfo.role === "eventManager" || userInfo.role === "admin") && (
                <Link
                  to="/event-manager"
                  className="bg-lime-400 text-black py-2 px-4 rounded-md hover:bg-lime-500 focus:outline-none flex items-center font-medium"
                >
                  <span className="mr-2">+</span> Create Event
                </Link>
              )}
              <div className="flex items-center">
                <label htmlFor="filter" className="mr-2 text-gray-700">
                  Filter:
                </label>
                <select
                  id="filter"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="registered">Registered</option>
                </select>
              </div>
            </div>
          </div>
          
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error" onClose={() => dispatch(clearError())}>
              {error}
            </Message>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-xl font-semibold mb-2">No events found</h2>
              <p className="text-gray-600 mb-6">There are no events matching your filter criteria.</p>
              {userInfo && (userInfo.role === "eventManager" || userInfo.role === "admin") && (
                <Link
                  to="/event-manager"
                  className="bg-lime-400 text-black py-2 px-4 rounded-md hover:bg-lime-500 focus:outline-none inline-flex items-center font-medium"
                >
                  <span className="mr-2">+</span> Create Event
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-lime-400 py-4">
        <div className="container mx-auto px-4 text-center text-white">
          <h3 className="font-semibold mb-1">Connect</h3>
          <p className="text-sm mb-1">Connecting Centennial College Students</p>
          <p className="text-xs">© 2025 Connect. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;