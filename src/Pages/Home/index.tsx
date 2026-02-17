import { AddBoxOutlined, Book, CarRental, ChatBubbleRounded, ChatRounded, CleanHands, CleanHandsOutlined, CleaningServicesSharp, GifBox, GradeOutlined, Map, MedicalInformation, NearMe, Person, PlayCircleFilled, ProductionQuantityLimits, Report, Security, SecuritySharp, Store, StoreSharp } from "@mui/icons-material";
import { Box, Grid, Paper, styled } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "./Header";
import { useUser } from "../../Context/userContext";
import HomeMenu from "./HomeMenu";
import pigs from './pigs.png'
import ProductCatalog from "../../Component/ProductCatalog/ProductCatalog";
import NewsTicker from "../../Component/NewsTicker";

export default function Home() {

    const { user } = useUser();

    return (
        <Box sx={{ flexGrow: 1, padding: 1, backgroundImage: pigs }}>
            <Header />
            <HomeMenu />
            {/* <ProductCatalog />
            <NewsTicker /> */}
        </Box>
    );
}