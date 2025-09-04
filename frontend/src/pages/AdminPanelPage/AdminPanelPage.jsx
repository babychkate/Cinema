import AddAction from "@/components/AdminOptionComponents/AddAction/AddAction";
import AddFilm from "@/components/AdminOptionComponents/AddFilm/AddFilm";
import AddHall from "@/components/AdminOptionComponents/AddHall/AddHall";
import AddSession from "@/components/AdminOptionComponents/AddSession/AddSession";
import AddSnack from "@/components/AdminOptionComponents/AddSnack/AddSnack";
import ListOfActions from "@/components/AdminOptionComponents/ListOfActions/ListOfActions";
import ListOfFilms from "@/components/AdminOptionComponents/ListOfFilms/ListOfFilms";
import ListOfHalls from "@/components/AdminOptionComponents/ListOfHalls/ListOfHalls";
import ListOfReviews from "@/components/AdminOptionComponents/ListOfReviews/ListOfReviews";
import ListOfSessions from "@/components/AdminOptionComponents/ListOfSessions/ListOfSessions";
import ListOfSnacks from "@/components/AdminOptionComponents/ListOfSnacks/ListOfSnacks";
import ListOfTickets from "@/components/AdminOptionComponents/ListOfTickets/ListOfTickets";
import ListOfUsers from "@/components/AdminOptionComponents/ListOfUsers/ListOfUsers";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const AdminPanelPage = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case "addHall":
                return <AddHall />;
            case "listOfHalls":
                return <ListOfHalls />;
            case "addSession":
                return <AddSession />;
            case "listOfSessions":
                return <ListOfSessions />;
            case "addFilm":
                return <AddFilm />;
            case "listOfFilms":
                return <ListOfFilms />;
            case "addSnack":
                return <AddSnack />;
            case "listOfSnacks":
                return <ListOfSnacks />
            case "addAction":
                return <AddAction />
            case "listOfActions":
                return <ListOfActions />
            case "listOfTickets":
                return <ListOfTickets />;
            case "listOfUsers":
                return <ListOfUsers />;
            case "listOfReviews":
                return <ListOfReviews />
            default:
                return <p className="text-gray-500">Select an action from the sidebar.</p>;
        }
    };

    return (
        <div className="flex">
            <div className="w-1/4 bg-gray-100 h-screen p-4">
                <div className="space-y-4">
                    <Button
                        variant={activeComponent === "addHall" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("addHall")}
                    >
                        Add halls
                    </Button>
                    <Button
                        variant={activeComponent === "listOfHalls" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfHalls")}
                    >
                        List halls
                    </Button>
                    <Button
                        variant={activeComponent === "addSession" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("addSession")}
                    >
                        Add sessions
                    </Button>
                    <Button
                        variant={activeComponent === "listOfSessions" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfSessions")}
                    >
                        List sessions
                    </Button>
                    <Button
                        variant={activeComponent === "addFilm" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("addFilm")}
                    >
                        Add films
                    </Button>
                    <Button
                        variant={activeComponent === "listOfFilms" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfFilms")}
                    >
                        List films
                    </Button>
                    <Button
                        variant={activeComponent === "addSnack" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("addSnack")}
                    >
                        Add snacks
                    </Button>
                    <Button
                        variant={activeComponent === "listOfSnacks" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfSnacks")}
                    >
                        List snacks
                    </Button>
                    <Button
                        variant={activeComponent === "addAction" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("addAction")}
                    >
                        Add actions
                    </Button>
                    <Button
                        variant={activeComponent === "listOfActions" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfActions")}
                    >
                        List actions
                    </Button>
                    <Button
                        variant={activeComponent === "listOfTickets" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfTickets")}
                    >
                        List tickets
                    </Button>
                    <Button
                        variant={activeComponent === "listOfUsers" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfUsers")}
                    >
                        List users
                    </Button>
                    <Button
                        variant={activeComponent === "listOfReviews" ? "destructive" : "outline"}
                        className="w-full py-2 px-4"
                        onClick={() => setActiveComponent("listOfReviews")}
                    >
                        List reviews
                    </Button>
                </div>
            </div>

            <div className="w-3/4 p-8">{renderComponent()}</div>
        </div>
    );
};

export default AdminPanelPage;
