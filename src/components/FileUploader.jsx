
import React from 'react'
import Icons from './Icons';

const FileUploader = ({setFollowers, setFollowing, selectFollowers, setSelectedFollowers, selectFollowing,  setSelectedFollowing, checkFollowers, setStatus }) => {

    function parseFile(e, type) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (evt) {
            const content = evt.target.result;
            try {
                let names = [];
                if (file.name.endsWith(".json")) {
                    const parsed = JSON.parse(content);
                    names = parsed.map(entry => entry.string_list_data?.[0]?.value).filter(Boolean);
                } else {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, "text/html");
                    const anchors = [...doc.querySelectorAll("a")];
                    names = anchors.map(a => a.textContent.trim()).filter(Boolean);
                }

                if (type === "followers") {
                    setFollowers(names);
                    setSelectedFollowers({ status: true, name: file.name });
                } else {
                    setFollowing(names);
                    setSelectedFollowing({ status: true, name: file.name });
                }

            } catch (error) {
                console.error("Failed to parse file: " + error.message);
                setStatus({show: true, msg: "Error reading file. Please upload a valid file."});
            }
        };

        reader.readAsText(file);
    }

  return (
    <div className='upload-container'>
    <div className='upload'>
        <label className='panel-2' htmlFor="followersFile"><Icons name="file" className="icon" /> <p>{selectFollowers.status ? selectFollowers.name : "Followers File"}</p></label>
        <input type="file" id="followersFile" accept=".json,.html" onChange={e => parseFile(e, "followers")} />
        <label className='panel-2' htmlFor="followingFile"><Icons name="file" className="icon" /> <p>{selectFollowing.status ? selectFollowing.name : "Following File"}</p></label>
        <input type="file" id="followingFile" accept=".json,.html" onChange={e => parseFile(e, "following")} />
    </div>
    <button className='btn-type-1' onClick={checkFollowers}>Check Followers</button>
</div>
  )
}

export default FileUploader