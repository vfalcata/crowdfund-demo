import React from "react";
import { Menu } from "semantic-ui-react";
import {Link} from "../routes"
//Link: allows us to render anchor tags into our react components and navigate around the application

const Header = (props) => {
    return(<Menu style={{ marginTop: '10px' }}>
        {/* link tag is a generic wrapper component that doesnt add any html of its own so we have to still add anchor tags manually. Instead it wraps its children with a click event handler so this is where we put our anchor tags */}
        <Link route="/">
            {/* className=item allows us to restore some of the stylings of semantic-ui */}
            <a className="item">CrowdCoin</a>            
        </Link>
        <Menu.Menu position="right">
        <Link route="/">
            <a className="item">Campaigns</a>            
        </Link>
        <Link route="/campaigns/new">
            <a className="item">+</a>            
        </Link>

        </Menu.Menu>
    </Menu>)
};
export default Header;