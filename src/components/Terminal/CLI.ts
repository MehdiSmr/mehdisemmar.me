const fileStructure : {[key: string]:  {[key: string]: string[]}} = {
    "home": {
        "experience": ["Raven Connected", "Versaterm","ISED","Wouessi Digital","SSC","Redal"],
        "projects": ["Dollaresume","SeekAndFind","RZO SPORTS","Github"],
        "extracurriculars": ["SESA Logistics Team Lead","uOttahack 8 Dev Team","3 hackathons participations","Volunteer Math Mentor"]
    }
}   

let currentDirectory : string = "home"

function executeCommand(input: string){
    let command = input.split(" ")[0]
    let argument = input.split(" ")[1]

    if (input.split(" ").length != 1 && input.split(" ").length != 2) return false
    console.log(command==="cd", command)
    switch (command){
        case "help":
            console.log("help: display this help message")
            console.log("aboutme: display information about me")
            console.log("skills: display my skills")
            console.log("cd: change directory")
            console.log("ls: list files in the current directory")
            return true
        case "aboutme":
            if (argument !== undefined) return false
            console.log("About me")
            return true

        case "skills":
            if (argument !== undefined) return false
            console.log("Skills")
            return true

        case "cd":
            if (argument === undefined) return false
            if (argument === ".."){
                currentDirectory = "home"
            }
            else {
                switch (argument){
                    case "experience":
                        currentDirectory = "experience"
                        break
                    case "projects":
                        currentDirectory = "projects"
                        break
                    case "extracurriculars":
                        currentDirectory = "extracurriculars"
                        break
                    default:
                        console.log("Invalid directory")
                        return false
                }
            }
            return true

        case "ls":
            if (argument === undefined){
                if (currentDirectory == "home"){
                    return printFiles(Object.keys(fileStructure["home"]))
                }
                else{
                    return printFiles(fileStructure["home"][currentDirectory])
                }
            }
            else{
                if (argument in fileStructure["home"]){
                    return printFiles(fileStructure["home"][argument])
                }
                else{
                    console.log("Invalid file")
                    return false
                }
            }

        //to implement
        case "open":
            console.log("Opening hologram...")
            return true

        //to implement
        case "exit":
            console.log("Exiting...")
            return true

        default:
            console.log("Invalid command")
            return false
    }
}

function printFiles(files: string[]){
    let output = ""
    for (let file of files){
        output += file + ", "
    }
    return output.slice(0, -2)
}

export { executeCommand, currentDirectory }
