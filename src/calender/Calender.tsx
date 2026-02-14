"use client";
import React, { useState } from "react";
// formatDate: helper function from FullCalendar to format dates nicely
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react"; // React wrapper for FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Month view plugin
import timeGridPlugin from "@fullcalendar/timegrid"; // Week/Day time grid plugin
import interactionPlugin from "@fullcalendar/interaction"; // Drag, select, click events
import { INITIAL_EVENTS, createEventId } from "./event-utils"; // helper data and ID generator

export default function Calender({ mode }) {
    // State to toggle weekend visibility
    const [weekendsVisible, setWeekendsVisible] = useState(true);

    // State to keep track of current events in the calendar
    const [currentEvents, setCurrentEvents] = useState([]);

    // Determine if dark mode is active
    const darkMode = mode === "dark";

    // Toggle weekends on/off
    const handleWeekendsToggle = () => setWeekendsVisible(!weekendsVisible);

    // Function when a date range is selected
    const handleDateSelect = (selectInfo) => {
        const title = prompt("Enter event title"); // ask user for event title
        const calendarApi = selectInfo.view.calendar; // access calendar instance
        calendarApi.unselect(); // clear selection highlight

        // If user entered a title, create new event
        if (title) {
            calendarApi.addEvent({
                id: createEventId(), // unique ID
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    };

    // Function when an event is clicked
    const handleEventClick = (clickInfo) => {
        if (confirm(`Delete event '${clickInfo.event.title}'?`))
            clickInfo.event.remove(); // remove event from calendar
    };

    return (
        <div className={`flex flex-col lg:flex-row min-h-[calc(100vh-120px)] p-3 sm:p-4 md:p-6 gap-6 transition-colors duration-300 overflow-x-hidden ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
            {/* Main Calendar Container */}
            <div className={`flex-1 rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 transition-colors duration-300 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"}`}>

                {/* Inline styles to customize FullCalendar theme based on dark/light mode */}
                <style>{`
                    .fc { width: 100%; }
                    .fc .fc-toolbar-title { color: ${darkMode ? '#f8fafc' : '#1e293b'}; font-size: clamp(1rem, 2vw, 1.4rem); }
                    .fc .fc-button { padding: 4px 8px; font-size: 12px; }
                    .fc .fc-button-primary { background-color: ${darkMode ? '#334155' : '#3b82f6'}; border: none; }
                    .fc .fc-button-primary:hover { background-color: ${darkMode ? '#475569' : '#2563eb'}; }
                    .fc .fc-button-active { background-color: ${darkMode ? '#0ea5e9' : '#1d4ed8'} !important; }
                    .fc td, .fc th { border-color: ${darkMode ? '#475569' : '#e2e8f0'} !important; }
                    .fc .fc-daygrid-day-number { color: ${darkMode ? '#cbd5e1' : '#334155'}; padding: 2px; font-size: 12px; }
                `}</style>

                {/* FullCalendar Component */}
                <FullCalendar
                    height="auto"
                    aspectRatio={window.innerWidth < 640 ? 0.9 : 1.8} // responsive aspect ratio
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // plugins to use
                    headerToolbar={{
                        left: "prev,next", // navigation buttons
                        center: "title", // month/week/day title
                        right: "today dayGridMonth,timeGridWeek" // view buttons
                    }}
                    initialView="dayGridMonth" // default view
                    editable // allow dragging/resizing events
                    selectable // allow selecting dates
                    selectMirror // show placeholder when selecting
                    dayMaxEvents // show "+ more" if too many events
                    weekends={weekendsVisible} // show weekends or not
                    initialEvents={INITIAL_EVENTS} // initial events to display
                    select={handleDateSelect} // handle new selection
                    eventClick={handleEventClick} // handle clicks on events
                    eventsSet={setCurrentEvents} // keep state in sync
                    eventContent={(arg) => (
                        // Custom rendering of event inside the calendar
                        <div className={`px-1 py-0.5 rounded text-[10px] sm:text-xs font-medium truncate ${darkMode ? "bg-sky-600 text-white" : "bg-sky-500 text-white"}`}>
                            <b>{arg.timeText}</b> <i>{arg.event.title}</i>
                        </div>
                    )}
                />
            </div>

            {/* Sidebar showing events and toggles */}
            <Sidebar
                weekendsVisible={weekendsVisible}
                handleWeekendsToggle={handleWeekendsToggle}
                currentEvents={currentEvents}
                darkMode={darkMode}
            />
        </div>
    );
}

// ================= Sidebar Component =================
function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents, darkMode }) {
    return (
        <div className="w-full lg:w-80 flex flex-col gap-5">
            {/* Toggle Weekends */}
            <div className={`${darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-800 border-slate-200"} border rounded-xl shadow-md p-4 transition-colors duration-300`}>
                <label className="flex items-center justify-between font-medium cursor-pointer">
                    Show Weekends
                    <input
                        type="checkbox"
                        checked={weekendsVisible}
                        onChange={handleWeekendsToggle}
                        className="w-4 h-4 accent-sky-500"
                    />
                </label>
            </div>

            {/* Events List */}
            <div className={`${darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-800 border-slate-200"} border rounded-xl shadow-md p-4 flex-1 overflow-y-auto max-h-[400px] lg:max-h-[600px] transition-colors duration-300`}>
                <h3 className="font-semibold mb-3 border-b pb-2 flex justify-between items-center text-sm">
                    <span>Events List</span>
                    <span className="bg-sky-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {currentEvents.length} {/* Number of events */}
                    </span>
                </h3>

                <div className="space-y-3">
                    {currentEvents.length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">No events found</p>
                    )}
                    {currentEvents.map((event) => (
                        <EventCard key={event.id} event={event} darkMode={darkMode} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ================= EventCard Component =================
function EventCard({ event, darkMode }) {
    // Delete event on click
    const handleDelete = () => { if (confirm(`Delete event '${event.title}'?`)) event.remove(); };

    // Edit event title
    const handleEdit = () => {
        const newTitle = prompt("Edit event title", event.title);
        if (newTitle) event.setProp("title", newTitle);
    };

    return (
        <div className={`p-3 rounded-xl shadow-sm border transition-all duration-300 hover:scale-[1.02] ${darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"}`}>
            {/* Date */}
            <div className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${darkMode ? "text-sky-400" : "text-sky-600"}`}>
                {formatDate(event.start, { year: "numeric", month: "short", day: "numeric" })}
            </div>
            {/* Title */}
            <div className={`font-semibold mb-2 truncate text-sm ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                {event.title}
            </div>
            {/* Actions */}
            <div className="flex gap-2">
                <button onClick={handleEdit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold py-1 rounded-md transition">Edit</button>
                <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold py-1 rounded-md transition">Delete</button>
            </div>
        </div>
    );
}
