import React, { useContext, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../index";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, MARKET_ROUTE } from "../utils/consts";

const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const click = () => {
    user.setUser({ email });
    user.setIsAuth(true);
    navigate(MARKET_ROUTE);
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 52 }}
    >
      <Card style={{ width: 700 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Authorization" : "Registration"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-5"
            placeholder="enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Row className="align-items-center mt-3">
            {isLogin ? (
              <Col>
                Account not registered? Please{" "}
                <NavLink to={REGISTRATION_ROUTE}>Sign Up</NavLink>
              </Col>
            ) : (
              <Col>
                Account registered? Please{" "}
                <NavLink to={LOGIN_ROUTE}>Sign In</NavLink>
              </Col>
            )}

            <Col xs="auto">
              <Button
                variant="outline"
                onClick={click}
                style={{
                  color: "rgb(143, 114, 222)",
                  borderColor: "rgb(143, 114, 222)",
                  borderWidth: "2px", 
                  fontWeight: "600",   
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgb(143, 114, 222)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgb(143, 114, 222)";
                }}
              >
                {isLogin ? "Log In" : "Register"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default Auth;
