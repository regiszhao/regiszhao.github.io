import React from 'react'
import ProjectsElem from './ProjectsElem'
import './ProjectsListAnimation'

function ProjectsList({projects}) {
    return(
        <ul className='ProjectsList'>
            {projects.map(project =>
                <ProjectsElem key={project.id} project={project}/>
            )}
        </ul>
    )
}

export default ProjectsList