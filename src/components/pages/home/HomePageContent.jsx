import { useState , useEffect } from 'react';

import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import { Trans , useTranslation } from 'react-i18next';

import { 
  Button , Image , Tab , Row , Nav , Col , Tabs , Stack
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket} from '@fortawesome/free-solid-svg-icons';

import HomePageHeroLabel from "./HomePageHeroLabel";

import imgSlide1 from '../../../assets/images/explorer-slide1.png';
import imgSlide0 from '../../../assets/images/explorer-slide0.png';

const HomePageContent = () => {

  const { t } = useTranslation();

  
  const [tabKey, setTabKey] = useState('tab-one');

  const token = useSelector((state) => state.auth.user.token);


  useEffect(() => {
    
    /*
    // i18n.changeLanguage('fr');
    console.log('here...' , t );

    console.log('here... 2' , t('title'));
    */

  }, []);


  const doHandleHeroLabelClick = (key) => {
    setTabKey(key);
  }

  const heroTexts = [
    {
      key: 'tab-one',
      text: t('homePage.heroText.group1.text') ,
      subText: t('homePage.heroText.group1.subText') 
    },
    {
      key: 'tab-two',
      text: t('homePage.heroText.group2.text') ,
      subText: t('homePage.heroText.group2.subText') 
    },
    {
      key: 'tab-three',
      text: t('homePage.heroText.group3.text') ,
      subText: t('homePage.heroText.group3.subText') 
    },
    {
      key: 'tab-four',
      text: t('homePage.heroText.group4.text') ,
      subText: t('homePage.heroText.group4.subText')
    }
  ];

  

  return(

    <div className="w-100" style={{paddingLeft:"1.1rem"}} >
          
      <div className="d-flex justify-content-start w-100" >
        <h2> 
          
          
          <Trans i18nKey="homePage.welcome">
            Welcome to Olrac Explorer
          </Trans>
          
          <Link to="/login">
            <Button size="lg"  className="nav-button ddl-button-style-light-blue ms-3" > 
              <FontAwesomeIcon icon={faRocket} className="me-2" /> <Trans i18nKey="common.getStarted"> Get Started </Trans> 
            </Button>
          </Link>

        </h2>
      </div>


      <div className="d-flex justify-content-center w-100 mt-5" >
        
        <div className="mt-1">
          

          <Tab.Container id="left-tabs-example" defaultActiveKey="tab-one" activeKey={tabKey} transition={false}  >
            <Row className="position-relative ddl-hero-front"  >

              <Col md={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="tab-one" >

                    <Image 
                      fluid
                      src={imgSlide0} 
                      alt="Explorer slide 1"
                    /> 

                  </Tab.Pane>

                  <Tab.Pane eventKey="tab-two">

                    <Image 
                      fluid
                      src={imgSlide0} 
                      alt="Explorer slide 1"
                    /> 

                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-three">

                    <Image 
                      fluid
                      src={imgSlide0} 
                      alt="Explorer slide 2"
                    /> 

                  </Tab.Pane>

                  <Tab.Pane eventKey="tab-four">

                    <Image 
                      fluid
                      src={imgSlide0} 
                      alt="Explorer slide 3"
                    /> 

                  </Tab.Pane>
                </Tab.Content>
              </Col>


              <Col md={9} className="d-none d-lg-block position-absolute top-0 end-0 ddl-hero-behind" style={{marginRight : "-37%" , marginTop : "3%"}}   >

                <div > 

                  <Stack direction="vertical" gap={5}>

                    { heroTexts.map((heroContent) => (
                      <HomePageHeroLabel
                        key = {`hero-content_${heroContent.key}`}
                        content = {heroContent}
                        handleHeroLabelClick = {doHandleHeroLabelClick}
                      />
                    ))}

                  </Stack>


                </div>

              </Col>



              {/* OEM 
              <Col sm={3} style={{ marginLeft : "-9%" , marginTop : "200px" }}>
                <Nav variant="pills" className="flex-column" > 
                  
                  <Nav.Item>
                    <Nav.Link eventKey="1" style={{padding:"0" , margin : "0"}}> 

                    <div style={{width: "200px" , borderTop : "5px dashed yellow"}} ></div>
                    Remote management 

                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link eventKey="first"> In depth Data Analysis </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link eventKey="first"> Visualize your fishing data </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second"> Get AI based fishing prediction </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third"> AI powered Onboard Camera Sightings  <br />  Location based onboard Camera feedbacks  </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              */}

            </Row>
          </Tab.Container>


        </div>


      </div>
    </div>
  );
}

export default HomePageContent;