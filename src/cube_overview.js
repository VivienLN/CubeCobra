import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Card, CardHeader, CardBody, CardText, Button } from 'reactstrap';

import DynamicFlash from './components/DynamicFlash';
import BlogPost from './components/BlogPost';
import CSRFForm from './components/CSRFForm';

class CubeOverview extends Component {
  constructor(props) {
    super(props);

    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);

    this.state = {
      followed: this.props.followed,
    };
  }

  follow() {
    this.setState({
      followed: true,
    });
    csrfFetch(`/cube/follow/${this.props.cube._id}`, {
      method: 'POST',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        console.log(response);
      }
    });
  }

  unfollow() {
    this.setState({
      followed: false,
    });
    csrfFetch(`/cube/unfollow/${this.props.cube._id}`, {
      method: 'POST',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        console.log(response);
      }
    });
  }

  render() {
    const { post, cube, price, owner, admin } = this.props;
    return (
      <>
        <DynamicFlash />
        <Row>
          <Col md="4">
            <Card className="mt-3">
              <CardHeader>
                <h3>{cube.name}</h3>
                <h6 className="card-subtitle mb-2 text-muted">{cube.users_following.length}
{' '}
followers
</h6>
              </CardHeader>
              <img className="card-img-top w-100" src={cube.image_uri} />
              <em className="text-right p-1">
                Art by:
                {cube.image_artist}
              </em>
              <CardBody>
                {cube.type && (
                  <>
                    <a>
                      {cube.card_count} Card{cube.type} Cube
                    </a>
                    <br />
                  </>
                )}
                {!cube.privatePrices && (
                  <>
                    <a>Approx: $
{price}
</a>
                    <br />
                  </>
                )}
                <a href={`/cube/rss/${cube._id}`}>RSS</a>
                <em>
                  <h6>
                    Designed by
                    <a href={`/user/view/${owner}`}> {owner}</a>
                  </h6>
                </em>
                {admin && (
                  <CSRFForm
                    method="POST"
                    id="featuredForm"
                    action={`/cube/${cube.isFeatured ? 'unfeature' : 'feature'}${cube._id}`}
                  >
                    <Button color="success" type="submit">
                      {' '}
                      {cube.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                    </Button>
                  </CSRFForm>
                )}
              </CardBody>
              {loggedIn ? (
                this.state.followed ? (
                  <Button outline color="danger" className="rounded-0" onClick={this.unfollow}>
                    Unfollow
                  </Button>
                ) : (
                  <Button color="success" className="rounded-0" onClick={this.follow}>
                    Follow
                  </Button>
                )
              ) : (
                []
              )}
            </Card>
          </Col>
          <Col>
            <Card className="mt-3">
              <CardHeader>
                <h5 className="card-title">Description</h5>
              </CardHeader>
              <CardBody>
                {cube.descriptionhtml ? (
                  <CardText dangerouslySetInnerHTML={{ __html: cube.descriptionhtml }} />
                ) : (
                  <CardText>{cube.description}</CardText>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {post && <BlogPost key={post._id} post={post} canEdit={false} userid={userid} loggedIn={loggedIn} />}
      </>
    );
  }
}

const loggedIn = document.getElementById('userid') != null;
const userid = loggedIn ? document.getElementById('userid').value : '';
const canEdit = document.getElementById('canEdit').value === 'true';
const blog = JSON.parse(document.getElementById('blogData').value);
const cube = JSON.parse(document.getElementById('cubeData').value);
const price = document.getElementById('priceData').value;
const owner = document.getElementById('ownerData').value;
const admin = JSON.parse(document.getElementById('adminData').value) == true;
const followed = JSON.parse(document.getElementById('followedData').value) == true;
const wrapper = document.getElementById('react-root');
const element = (
  <CubeOverview post={blog || null} cube={cube} price={price} owner={owner} admin={admin} followed={followed} />
);
wrapper ? ReactDOM.render(element, wrapper) : false;