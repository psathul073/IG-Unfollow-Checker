import React, { useEffect, useState } from 'react';
import Message from './Message';
import Icons from './Icons';
import FileUploader from './FileUploader';
import Instructions from './Instructions';
import Modal from './Modal';

function Home() {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [count, setCount] = useState({unfollowers: "", mutualFollowers: ""})
    const [showUpload, setSHowUpload] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const [showInstruction, setShowInstruction] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState({show: false, msg: ""});
    const [selectFollowers, setSelectedFollowers] = useState({ status: false, name: "" });
    const [selectFollowing, setSelectedFollowing] = useState({ status: false, name: "" });
    const [sortOrder, setSortOrder] = useState({ unfollowers: true, mutualFollowers: true });

   // Preload bg-img 
    useEffect( () => {
        const img = new Image();
        img.src = "https://i.postimg.cc/XvDvsF5V/bg.png";
        img.onload = ()=> {
            document.body.classList.add("lazy-bg");
        };
    },[]);

    function checkFollowers() {
        if (!followers.length || !following.length) {
            setStatus({show: true, msg: "Please upload both files."});
            return;
        }
        const unfollowers = following.filter(user => !followers.includes(user));
        const mutuals = following.filter(user => followers.includes(user));
        setCount({ unfollowers: unfollowers.length, mutualFollowers: mutuals.length})
        const previous = JSON.parse(localStorage.getItem("previousUnfollowers") || "[]");

        localStorage.setItem("previousUnfollowers", JSON.stringify(unfollowers));
        renderTable("unfollowersTable", unfollowers, "unfollowers", previous);
        renderTable("mutualFollowersTable", mutuals, "mutualFollowers");
        setSHowUpload(false);
        setShowInstruction(false);
        setStatus({ show:true, msg: "Comparison complete."});
    };

    function renderTable(tableId, data, type, previous = []) {
        setShowTable(true);
        const tbody = document.querySelector(`#${tableId} tbody`);
        tbody.innerHTML = "";
        data.forEach(name => {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.textContent = name;

            // ⬇ Add click listener to open modal
            cell.addEventListener("click", () => {
                setSelectedUser(name);
                setIsModalOpen(true);
                cell.style.textDecoration = "line-through";
            });

            if (type === "unfollowers" && !previous.includes(name)) {
                cell.classList.add("new-unfollower");
            }
            row.appendChild(cell);
            tbody.appendChild(row);
        });
    };

    function toggleSort(type) {
        const table = document.getElementById(`${type}Table`);
        const header = document.getElementById(`${type}Header`);
        const rows = Array.from(table.querySelector("tbody").rows);

        const sortedRows = rows.sort((a, b) => {
            const textA = a.cells[0].textContent.toLowerCase();
            const textB = b.cells[0].textContent.toLowerCase();
            return sortOrder[type] ? textA.localeCompare(textB) : textB.localeCompare(textA);
        });

        header.className = sortOrder[type] ? "sorted-asc" : "sorted-desc";
        setSortOrder(prev => ({ ...prev, [type]: !prev[type] }));

        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";
        sortedRows.forEach(row => tbody.appendChild(row));
    };

    function filterList(type) {
        const search = document.getElementById(`${type}Search`).value.toLowerCase();
        const rows = document.querySelectorAll(`#${type}Table tbody tr`);
        rows.forEach(row => {
            const username = row.cells[0].textContent.toLowerCase();
            row.style.display = username.includes(search) ? "" : "none";
        });
    };


    return (
        <section className='container'>

            <header className='header'>
                <h2>Instagram Unfollow Checker</h2>
            </header>

            {showUpload && <FileUploader setFollowers={setFollowers} setFollowing={setFollowing} selectFollowers={selectFollowers} setSelectedFollowers={setSelectedFollowers} selectFollowing={selectFollowing} setSelectedFollowing={setSelectedFollowing} checkFollowers={checkFollowers} setStatus={setStatus} />}

            {status.show && <Message status={status} setStatus={setStatus} />}

            <div className='table-section' style={{ display: !showTable && "none" }}>

                <div className='unfollowers'>

                    <div className='search-section'>
                        <h3>Search Unfollowers</h3>

                        <div className='search-input'>

                            <input type="text" id="unfollowersSearch" onInput={() => filterList('unfollowers')} placeholder="Search unfollowers..." />
                            <button onClick={() => toggleSort('unfollowers')}><Icons name={"sort"} /></button>

                        </div>

                    </div>

                    <table id="unfollowersTable">
                        <thead>
                            <tr><th id="unfollowersHeader">Username <span> New</span></th></tr>
                        </thead>
                        <tbody></tbody>
                    </table>

                </div>

                <div className='mutalFollowers'>
                    <div className='search-section'>
                        <h3>Search Mutual Followers</h3>
                        <div className='search-input'>
                            <input type="text" id="mutualFollowersSearch" onInput={() => filterList('mutualFollowers')} placeholder="Search mutual followers..." />
                            <button onClick={() => toggleSort('mutualFollowers')}><Icons name={"sort"} /></button>
                        </div>

                    </div>

                    <table id="mutualFollowersTable">
                        <thead>
                            <tr><th id="mutualFollowersHeader">Username</th></tr>
                        </thead>
                        <tbody></tbody>
                    </table>

                </div>


            </div>

            {showInstruction && <Instructions /> }

            {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} selectedUser={selectedUser} count={count} />}

           { showInstruction && <footer>
                <p>Made with ❤️ by d9.coder</p>
            </footer>}
        </section>
    );
}

export default Home;
