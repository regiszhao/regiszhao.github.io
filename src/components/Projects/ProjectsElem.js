import React from 'react'
import './ProjectsListAnimation.js'

function ProjectsElem({project}) {
    return(
        <li className='ProjectsElem'>
            <img className='ProjectImage' src={project.imageurl} />
            <div className='ProjectsElemText'>
                <h3 className='projectName'>{project.projectName}</h3>
                <p className='projectDescrip'>{project.projectDescription}</p>
            </div>
            <script src='ProjectsListAnimation.js'></script>
        </li>
    )
}

export default ProjectsElem