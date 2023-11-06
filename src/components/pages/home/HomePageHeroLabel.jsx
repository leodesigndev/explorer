import { useState } from 'react';

import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import { 
  Button , Image , Tab , Row , Nav , Col , Tabs , Stack
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket} from '@fortawesome/free-solid-svg-icons';

import imgSlide1 from '../../../assets/images/explorer-slide1.png';
import imgSlide0 from '../../../assets/images/explorer-slide0.png';

const HomePageHeroLabel = ( {content , handleHeroLabelClick } ) => {

  const [key, setKey] = useState('home');

  const token = useSelector((state) => state.auth.user.token);

  return(

    <Row className="ddl-hero-text" onClick={() => handleHeroLabelClick(content.key) } >
      <Col md={7} >

        <Stack direction="horizontal" gap={2} style={{cursor:"pointer" }} >
          <div>
            <div className="ddl-hero-dot-line"></div>
          </div>
          <div>
            
            <span 
              className="badge rounded-circle bg-light p-3 border border-5 border-secondary "
              style={{fontSize:".8rem" , marginTop : "10px" , marginLeft:"5px"}}
            > 
              <span class="visually-hidden">Visualize</span>
            </span>

          </div>
          <div>
            <h4 className="text-start" > {content.text} </h4>
            <div  className="text-start ddl-hero-sub-text" > {content.subText} </div>
          </div>
        </Stack>
        
      </Col>
    </Row>
  );
}

export default HomePageHeroLabel;