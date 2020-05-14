import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import ProjectItem from './ProjectItem';
import './ProjectList.scss';

const ProjectList: React.FC<any> = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="project-list center">
        <Card>
          <h2>No projects found. Maybe create one?</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="project-list">
      {props.items.reverse().map((project: any) => (
        <ProjectItem
          key={project.id}
          id={project.id}
          name={project.name}
          price={project.price}
          status={project.status}
          tasks={project.tasks}
          ownerId={project.owner}
          onDelete={props.onDeleteProject}
        />
      ))}
    </ul>
  );
};

export default ProjectList;
