import { MixCli } from "../../../src"
import autocomplete from "./autocomplete"
import autocompleteMultiselect from "./autocompleteMultiselect"
import confirm from "./confirm"
import invisible from "./invisible"
import list from "./list"
import multiselect from "./multiselect"
import number from "./number"
import password from "./password"
import select from "./select"
import text from "./text"
import toggle from "./toggle"
import date from "./date"



 

const cli = new MixCli({
    name: "mixcli",
    title: ["mixcli commandline tool Version: {}","1.0.1"],
    version: "1.0.0",  
    logo: String.raw`
        ____   ____                  __            
        \   \ /   /___   ___________|  | _______   
         \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \  
          \     (  <_> )  ___/|  | \/    <  / __ \_
           \___/ \____/ \___  >__|  |__|_ \(____  /
                            \/           \/     \/`,
 
})

cli.register(autocomplete)
cli.register(autocompleteMultiselect)
cli.register(confirm)
cli.register(invisible)
cli.register(list)
cli.register(multiselect)
cli.register(number)
cli.register(password)
cli.register(select)
cli.register(text)
cli.register(toggle)
cli.register(date)

cli.run()