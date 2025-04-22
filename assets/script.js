



const disallowedidregex = /[^a-zA-Z0-9:._-]/g;// +/g;//matches multiple chars?
// console.log("0, 1, 2, 3, $&! this is a TEST : . _ - :._-".replace(disallowedidregex, ""));

function buildprojectelement(project, showthing, mapfulltohashtag, techtags){
    if(mapfulltohashtag[project.Title]!==undefined){
        throw new Error("Project title already defined: "+project.Title);
    }
   
    mapfulltohashtag[project.Title] = "proj_"+project.Title.replace(disallowedidregex, "");

    const projectbox = document.createElement("div");
    projectbox.id = mapfulltohashtag[project.Title];

    const projectelement = projectbox.appendChild(document.createElement("section"));
    projectelement.className = "project "+project.ProjectTags.join(" ");
    projectelement.appendChild(document.createElement("h3")).innerText = project.Title;
    
    if(project.Collaborative){
        const collabel = projectelement.appendChild(document.createElement("div"));
        collabel.innerText = "Collaborative Project";
        collabel.className = "collab";
    }
    projectelement.appendChild(document.createElement("p")).innerHTML = project.Headline;
    projectelement.appendChild(document.createElement("p")).innerHTML = project.Body;
    
    if(project.Links!==null){
        projectelement.appendChild(document.createElement("hr"));

        project.Links.forEach( link => {
            const anch = projectelement.appendChild(document.createElement("div"))
            .appendChild(document.createElement("a"));
            anch.innerText = link.Name!=null?link.Name:link.url;
            anch.href = link.url;
        });
    }

    projectelement.appendChild(document.createElement("hr"));

    const tagselement = projectelement.appendChild(document.createElement("ul"));
    project.Tags.forEach( full => {
        if(mapfulltohashtag[full]===undefined){
            const short = "tech_"+full.replace(disallowedidregex, "_");
            if(techtags.find( tt=>{return tt.short===short; } )!==undefined){
                throw new Error("I could implement this if needed, but i probably made a mistake in the json: "+full+" = "+short);
            }
            mapfulltohashtag[full] = short;
            techtags.push({full, short, projects:[project.Title]});
        } else {
            techtags.find( tt=>{return tt.full===full; } ).projects.push(project.Title);
        }

        const btn = tagselement.appendChild(document.createElement("li"))
            .appendChild(document.createElement("button"));
        btn.innerText = full;
        btn.dataset.hash = mapfulltohashtag[full];
        btn.onclick = showthing;
    });

    if(project.Images!==undefined){
        const projectgallery = document.body.appendChild(document.createElement("div"));
        projectgallery.popover = "auto";

        const gallerypopover = projectgallery.appendChild(document.createElement("div"));
        gallerypopover.className = "gallerypopover";
        
        const closegallerybutton = gallerypopover.appendChild(document.createElement("button"));
        closegallerybutton.popoverTargetElement = projectgallery;
        closegallerybutton.popovertargetaction = "hide";
        closegallerybutton.appendChild(document.createElement("p"));
        
        const gallerybutton = projectelement.appendChild(document.createElement("button"));
        gallerybutton.innerText = "View Images";
        gallerybutton.popoverTargetElement = projectgallery;
        gallerybutton.popovertargetaction = "show";
        
        const gallery = projectbox.appendChild(document.createElement("div"));
        gallery.className = "gallery";
                
        const fullwidth = gallery.appendChild(document.createElement("div"))
            .appendChild(document.createElement("div"));
        
        project.Images.forEach( image=>{
            const img = fullwidth.appendChild(document.createElement("img"));
            img.src = "assets/projects/images/"+image;
            img.alt = "Image depicting "+project.Title+".";
            
            const imagepress = gallerypopover.appendChild(document.createElement("button"));
            imagepress.appendChild(img.cloneNode(true));
            imagepress.onclick = (event)=>{
                window.open(img.src,'_blank');
            };
        });
    }

    return projectbox;
}





function setdoc(ProjectData){
    const mapfulltohashtag = {};
    const techtags = [];

    const centrecolumn = document.getElementsByTagName("main")[0];
    const projectselement = centrecolumn.appendChild(document.createElement("article"));
    projectselement.id = "projects";
    const techselement = centrecolumn.appendChild(document.createElement("article"));

    const showthing = (event) => {//?. optional chaining operator is not present in old ipad safari - js error.
        const hashtag = event===undefined?(window.location.hash.slice(1))
        :event?.target?.dataset?.hash;
        if( (hashtag==="technologies") || (techtags.find( tt=>{return tt.short===hashtag;})!==undefined) ){
            techselement.style.display = "";
            projectselement.style.display = "none";
        } else {
            techselement.style.display = "none";
            projectselement.style.display = "";
        }
        if(hashtag!==undefined && hashtag!==""){
            window.location.hash = "#"+hashtag;
            document.getElementById(hashtag)?.scrollIntoView();//?.
        }
    }
    

    const nav = document.getElementsByTagName("nav")[0];
    const projbtn = nav.appendChild(document.createElement("button"));
    projbtn.innerText = "Projects";
    projbtn.dataset.hash = "projects";
    projbtn.onclick = showthing;
    const techbtn = nav.appendChild(document.createElement("button"));
    techbtn.innerText = "Technologies";
    techbtn.dataset.hash = "technologies";
    techbtn.onclick = showthing;


    projectselement.appendChild(document.createElement("h2")).innerText = "Selected Projects";
    ProjectData.ProjectList.forEach( project => {
        if(project.Omit){
            return;//forEach, so not continue
        }
        projectselement.appendChild( buildprojectelement(project, showthing, mapfulltohashtag, techtags) );
    });

    techtags.sort( (a,b) => {
        return a.full.toUpperCase()>b.full.toUpperCase()?1:-1;
    });

    techselement.appendChild(document.createElement("h2")).innerText = "Technologies";
    const tagslistelement = techselement.appendChild(document.createElement("ul"));
    tagslistelement.id = "technologies";

    techtags.forEach( tt => {
        const thistagelement = tagslistelement.appendChild(document.createElement("li"));
        thistagelement.innerText = tt.full;
        thistagelement.id = tt.short;
        
        const projectlistelement = thistagelement.appendChild(document.createElement("ul"));
        
        tt.projects.forEach( title => {
            const btn = projectlistelement.appendChild(document.createElement("li"))
                .appendChild(document.createElement("button"));
            btn.innerText = title;
            btn.dataset.hash = mapfulltohashtag[title];
            btn.onclick = showthing;
        });
    });

    showthing();
}


const addscroller = ()=>{
    const scroller = document.getElementById("scroller");//html ids were actually globals in js in old ipad? redefining causes script to crash.
    const over = document.getElementById("over");
    scroller.onscroll = ()=>{
        if (scroller.scrollTop > 100) {
            over.style.top = "0.25rem";
            over.style.opacity = "1";
        } else {
            over.style.top = "-3rem";
            over.style.opacity = "0";
        }
    };
};
addscroller();


const loadProjectData = async(request) => {
    await fetch(request)
    .then( response => response.text() )
    .then( responsetext => JSON.parse(responsetext) )
    .then( ProjectData => { setdoc(ProjectData); } )
    .catch( (e) => {
        console.log(e);
    });
}

await loadProjectData( new Request("assets/projects/ProjectData.json", {
    method: "GET",
}));


