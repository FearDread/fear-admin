import React from "react";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";

/**
 * Dashboard statistic tile: a tinted icon, a label, a big number and an optional footer line.
 *
 * Usage:
 *   <Row className="mb-4">
 *     <StatCard icon="fa-tag" tone="primary" label="Total Brands" value={42} />
 *     <StatCard icon="fa-dollar" tone="success" label="Revenue" value="$8,420" footer={<small>+4% vs last month</small>} />
 *   </Row>
 *
 * Props
 *   icon    Font Awesome 4 class, e.g. "fa-tag"
 *   tone    primary | success | warning | danger | info (drives the icon color and tint)
 *   label   small caption above the value
 *   value   number or string to display
 *   footer  optional node rendered under the value
 *   colProps  optional reactstrap <Col> props; defaults to { lg: "3", md: "6" }
 */
const StatCard = ({ icon, tone = "primary", label, value, footer, colProps }) => (
    <Col lg="3" md="6" {...colProps}>
        <Card className="card-stats media-object">
            <CardBody>
                <Row>
                    <Col xs="5">
                        <div className={`icon-big text-center circle-1 bg-${tone}-light2`}>
                            <i className={`fa ${icon} text-${tone}`} aria-hidden="true"></i>
                        </div>
                    </Col>
                    <Col xs="7">
                        <div className="numbers">
                            <p className="card-category text-light-2">{label}</p>
                            <CardTitle tag="h3" className="text-white">{value}</CardTitle>
                            {footer && <p className="mb-0">{footer}</p>}
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    </Col>
);

export default StatCard;