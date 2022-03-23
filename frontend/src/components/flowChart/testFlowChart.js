/*import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate  } from "react-router-dom";
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges } from 'react-flow-renderer';
import StudentDataService from "../../services/studentService";
import TextUpdaterNode from './TextUpdaterNode';

import './text-updater-node.css';


const Flow = props => {
  
  const rfStyle = {
    backgroundColor: '#B8CEFF',
  };
  
  const initialNodes = [
  ];
  
  const initialStudentState = {
    student_id: null,
    name: "",
    average: "",
    units: "",
    semester:"",
    years:"",
    courses: []
  };
  
  const initialEdges = [
    { id: 'edge-1', source: 'node-1', target: 'node-2', sourceHandle: 'a' },
    { id: 'edge-2', source: 'node-1', target: 'node-3', sourceHandle: 'b' },
  ];
  
  // we define the nodeTypes outside of the component to prevent re-renderings
  // you could also use useMemo inside the component
  const nodeTypes = { textUpdater: TextUpdaterNode };
  
  const params = useParams();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [student, setStudent] = useState(initialStudentState);

  useEffect(() => {
    getStudent(params.id);
    //retrieveStudents();
  }, []);

  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(response => {
        setStudent(response.data);
        for (let i = 0; i < response.data.courses.length; i++){
              setNodes(    
                [
                  { id: 'node-1', 
                    type: 'output', 
                    position: { x: 0, y:  -200}, 
                    data: { label: 'node 1' } 
                  },
                  {
                    id: 'node-2',
                    type: 'output',
                    targetPosition: 'top',
                    position: { x: 200, y: 0 },
                    data: { label: 'node 2' },
                  },
                  {
                    id: 'node-3',
                    type: 'output',
                    targetPosition: 'top',
                    position: { x: 200, y: 200 },
                    data: { label: 'node 3' },
                  },
                ])
              }
        console.log(response.data.courses);
      })
      .catch(e => {
        console.log(e);
      });
  };

  

  return (
    <div style={{width:'100%', height:'100vh'}}>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      style={rfStyle}
      />
    </div>
    
  );
}

export default Flow;*/
