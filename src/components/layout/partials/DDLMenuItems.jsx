import { 
  Stack
} from 'react-bootstrap';

const DDLMenuBar = ({children}) => {

  return(
    <div className="ms-auto" style={{marginRight:"62px" }}> 
      <Stack direction="horizontal" gap={2}  >
        {children}
      </Stack>
    </div>
  );
}

export default DDLMenuBar;