import React from 'react'
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import Icons from './Icons';

const Modal = ({ setIsModalOpen, selectedUser, count }) => {

    function exportCSV(type) {
        const rows = document.querySelectorAll(`#${type}Table tbody tr`);
        if (!rows.length) return alert("No data to export!");
        const csv = ["Username", ...Array.from(rows).map(row => row.cells[0].textContent)].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        downloadBlob(blob, `${type}-${new Date().toISOString().split("T")[0]}.csv`);
    };

    function exportPDF(type) {
        const rows = document.querySelectorAll(`#${type}Table tbody tr`);
        if (!rows.length) return alert("No data to export!");
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`Instagram ${type}`, 10, 10);
        rows.forEach((row, i) => {
            doc.text(row.cells[0].textContent, 10, 20 + (i * 10));
        });
        doc.save(`${type}-${new Date().toISOString().split("T")[0]}.pdf`);
    };

    function exportZIP() {
        const rows1 = Array.from(document.querySelectorAll(`#unfollowersTable tbody tr`)).map(row => row.cells[0].textContent);
        const rows2 = Array.from(document.querySelectorAll(`#mutualFollowersTable tbody tr`)).map(row => row.cells[0].textContent);
        if (!rows1.length && !rows2.length) return alert("No data to export!");

        const zip = new JSZip();
        zip.file("unfollowers.csv", ["Username", ...rows1].join("\n"));
        zip.file("mutual_followers.csv", ["Username", ...rows2].join("\n"));
        zip.generateAsync({ type: "blob" }).then(content => {
            downloadBlob(content, `followers_export_${new Date().toISOString().split("T")[0]}.zip`);
        });
    };

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    function Copy(name) {
        let tempText = document.createElement("input");
        tempText.value = name;
        document.body.appendChild(tempText);
        tempText.select();
        document.execCommand("copy");
        document.body.removeChild(tempText);
    };


    return (
        <div className="modal-overlay">
            <div className="modal">

                <div className='modal-head'>
                    <h3>User Info</h3>
                    <button onClick={() => setIsModalOpen(false)}><Icons name={"X"} className={"icon"} /></button>
                </div>

                <div className='username'>
                    <p>{selectedUser}</p>

                    <div className='buttons'>
                        <button onClick={() => Copy(selectedUser)}><Icons name={"copy"} /></button>
                        <button><a href={`https://instagram.com/${selectedUser}`} target="_blank" rel="noreferrer"><Icons name={"browse"} />
                        </a></button>
                    </div>

                </div>

                <div className='export'>
                    <h4>Exports</h4>

                    <div className='unfollowers'>Unfollowers : {count.unfollowers}
                        <div className='buttons'>
                            <button onClick={() => exportCSV('unfollowers')}><Icons name={"csv"} /></button>
                            <button onClick={() => exportPDF('unfollowers')}><Icons name={"pdf"} /></button>
                        </div>

                    </div>

                    <div className='mutalFollowers'>Mutual Followers : {count.mutualFollowers}
                        <div className='buttons'>
                            <button onClick={() => exportCSV('mutualFollowers')}><Icons name={"csv"} /></button>
                            <button onClick={() => exportPDF('mutualFollowers')}><Icons name={"pdf"} /></button></div>
                    </div>

                    <div className='download'>
                        Download Both as
                        <div className='buttons'>
                            <button onClick={exportZIP}> <Icons name={"zip"} /></button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default Modal