import { ref } from 'vue'

const fileStructure : {[key: string]:  {[key: string]: string[]}} = {
    "home": {
        "experience": ["Raven Connected", "Versaterm","ISED","Wouessi Digital","SSC","Redal"],
        "projects": ["Dollaresume","SeekAndFind","RZO SPORTS","Github"],
        "extracurriculars": ["SESA Logistics Team Lead","uOttahack 8 Dev Team","3 hackathons participations","Volunteer Math Mentor"]
    }
}   

let currentDirectory = ref("home")

function executeCommand(input: string){
    let command = input.split(" ")[0]
    let argument = input.split(" ")[1]

    if (input.split(" ").length != 1 && input.split(" ").length != 2) return "false"
    console.log(command==="cd", command)
    switch (command){
        case "game":
            console.log("Starting game...")
            return "true"

        case "clear":
            return "clear"

        case "help": // assistant start talking
            console.log("help: display this help message")
            console.log("aboutme: display information about me")
            console.log("skills: display my skills")
            console.log("cd: change directory")
            console.log("ls: list files in the current directory")
            console.log("open: open a file")
            console.log("exit: exit the terminal")
            console.log("game: start a game")
            console.log("clear: clear the terminal")
            return "true"
            
        case "aboutme":
            if (argument !== undefined) return "false"
            console.log("About me")
            return "true"

        case "skills":
            if (argument !== undefined) return "false"
            console.log("Skills")
            return "true"

        case "cd":
            if (argument === undefined) return "false"
            if (argument === ".."){
                currentDirectory.value = "home"
            }
            else {
                switch (argument){
                    case "experience":
                        currentDirectory.value = "experience"
                        break
                    case "projects":
                        currentDirectory.value = "projects"
                        break
                    case "extracurriculars":
                        currentDirectory.value = "extracurriculars"
                        break
                    default:
                        console.log("Invalid directory")
                        return "false"
                }
            }
            return "true"

        case "ls":
            if (argument === undefined){
                if (currentDirectory.value == "home"){
                    return printFiles(Object.keys(fileStructure["home"]))
                }
                else{
                    return printFiles(fileStructure["home"][currentDirectory.value])
                }
            }
            else{
                if (argument in fileStructure["home"]){
                    return printFiles(fileStructure["home"][argument])
                }
                else{
                    console.log("Invalid file")
                    return "false"
                }
            }

        //to implement
        case "open":
            console.log("Opening hologram...")
            return "true"

        //to implement
        case "exit":
            console.log("Exiting...")
            return "true"

        default:
            console.log("Invalid command")
            return "false"
    }
}

function printFiles(files: string[]){
    let output = ""
    for (let file of files){
        output += file + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }
    return output.trim()
}

export { executeCommand, currentDirectory }
