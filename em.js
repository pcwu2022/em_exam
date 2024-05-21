function crawlEm(downloadFile = true){
    const q = (query) => document.querySelectorAll(query);

    let sectionName = location.href.replace("https://em.emedu.org.tw/", "").replace(".aspx", "");

    let titles = q(".tittle-w3ls");
    let sections = q(".banner_bottom_pos_grid > ol");

    if (titles.length !== sections.length){
        throw new Error("Length Mismatch!");
    }

    let collection = {};

    for (let i = 0; i < titles.length; i++){
        let key = titles[i].textContent;
        collection[key] = [];
        for (let child of sections[i].children){
            let lastEl = [];
            for (let a of child.children){
                if (a.tagName === "A"){
                    lastEl.push(a.href);
                }
            }
            collection[key].push(lastEl);
        }
    }

    function download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }

    if (downloadFile){
        download(sectionName + ".json", JSON.stringify(collection, null, 4));
    } else {
        console.log(collection);
    }
    return collection;
}

function reconstruct(parsedJson){
    const cre = (tag) => document.createElement(tag); 
    for (let key in parsedJson){
        let section = cre("div");
        let title = cre("h3");
        title.innerHTML = key;
        section.appendChild(title);
        for (let pair of parsedJson[key]){
            let probDiv = cre("div");
            let prob = cre("img");
            prob.src = pair[0];
            prob.alt = "problem_" + key;
            prob.style.maxWidth = "400px";
            probDiv.appendChild(prob);
            let sol = cre("img");
            sol.src = pair[1];
            sol.alt = "solution_" + key;
            sol.style.maxWidth = "400px";
            probDiv.appendChild(sol);
            section.appendChild(probDiv);
            probDiv.style.margin = "20px";
            probDiv.style.border = "2px solid rgb(200,200,200)"; 
        }
        document.body.appendChild(section);
    }
}

function generate(){
    let js = crawlEm();
    document.body.innerHTML = "";
    document.body.style.color = "black";
    reconstruct(js);
    alert("Press Ctrl + P to generate PDF");
}

generate();