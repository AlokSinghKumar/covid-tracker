import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./InfoBox.css";

function InfoBox({title, cases, total}){
    return(
        <div>
            <Card className="infoBox">
                <CardContent>
                    {/* Title of the card */}
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>

                    {/* Number if cases */}
                    <h2 className="infoBox__cases">{cases}</h2>

                    {/* Total number of cases */}
                    <Typography className="infoBox__total" color="textSecondary">
                        {total} Total
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox;