import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import {
    Main,
    TitleText,
    Title,
    Details,
    Resources,
    DetailsBg,
    CustomSelect,
    CustomInput,
    CustomMenuItem,
    CustomMenuProps,
    LinkText,
    ApiKeyText,
    LinkBox,
    EndopointsSelectContainer,
    ResourcesLinksContainer,
    ResourcesLinks,
    ResourcesLinkItem,
    Modal,
    ModalDivider,
    ModalTitle,
    ModalContent,
    ModalAskText,
    ModalInfoText,
    ModalActionsWrapper,
    ModalButtonAccept,
    ModalButtonCancel,
} from './style';
import config from '../../config';

import CustomImg from '../../components/CustomImg';
import CopyButton from '../../components/CopyButton';
import bookIcon from '../../assets/img/book-icon.svg';
import programmingIcon from '../../assets/img/js-programming.svg';
import scriptIcon from '../../assets/img/script-code-coding.svg';
import refreshIcon from '../../assets/img/refresh.svg';

const {
    handbook,
    conseil,
    conseiljs,
    prodName,
    devName,
    devInfo,
    prodConseil,
    prodTezos,
    devConseil,
    devTezos,
    devJakartaConseil,
    devJakartaTezos
} = config;

const mainUrls = {
    prod: {
        conseil: [prodConseil],
        tezos: [prodTezos],
    },
    dev: {
        conseil: [devConseil, devJakartaConseil],
        tezos: [devTezos, devJakartaTezos],
    },
};

const Keys = (props) => {
    const { onLogout, userInfo } = props;
    const [apiKeys, setApiKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState(0);
    const [open, setOpen] = useState(false);

    async function getKeys() {
        try {
            const response = await axios.get(`${config.url}/users/me/apiKeys`, {
                withCredentials: true,
            });
            if (!!response.data && response.data.length > 1) {
                setApiKeys(response.data.slice().sort((a, b) => (a.env > b.env ? 1 : -1)));
            } else {
                onLogout();
            }
        } catch (error) {
            console.error('errr', error);
            onLogout();
        }
    }

    async function refreshKeys(env, index) {
        setOpen(false);
        try {
            const newKey = await axios.post(
                `${config.url}/users/me/apiKeys/${env}/refresh`,
                {},
                { withCredentials: true }
            );
            apiKeys[index] = newKey.data;
            setApiKeys([...apiKeys]);
        } catch (error) {
            console.error('errr', error);
        }
    }

    useEffect(() => {
        getKeys();
    }, [userInfo.userId]);

    function openUrl(url) {
        if (url) window.open(url, '_blank');
    }

    function getItemName(name) {
        return name === 'prod' ? prodName : devName;
    }

    function onChangeEndpoints(event) {
        setSelectedKey(event.target.value);
    }

    function onClose() {
        setOpen(false);
    }

    return (
        <>
            <Main container justify="center" direction="column">
                <Title item>
                    <TitleText>Tezos</TitleText>
                </Title>
                {apiKeys.length > 0 && (
                    <Details item>
                        <DetailsBg elevation={0}>
                            <Grid container direction="column" justify="center" spacing={3}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Endpoints</Typography>
                                        </Grid>
                                        <EndopointsSelectContainer item>
                                            <CustomSelect
                                                value={selectedKey}
                                                onChange={onChangeEndpoints}
                                                name="endpoints"
                                                MenuProps={CustomMenuProps}
                                                input={
                                                    <CustomInput
                                                        inputProps={{ 'aria-label': 'naked' }}
                                                    />
                                                }
                                                inputProps={{ 'aria-label': 'endpoints' }}
                                                IconComponent={ExpandMoreIcon}
                                            >
                                                {apiKeys.map((item, index) => (
                                                    <CustomMenuItem
                                                        value={index}
                                                        key={item.environment}
                                                    >
                                                        {getItemName(item.environment)}
                                                    </CustomMenuItem>
                                                ))}
                                            </CustomSelect>
                                        </EndopointsSelectContainer>
                                    </Grid>
                                </Grid>
                                 {apiKeys[selectedKey].environment === "dev" && (
				  <Grid item>
				    <Typography variant="subtitle2" color="textSecondary">
				      {devInfo}
				    </Typography>
				  </Grid>
				)}  
                                <Grid item>
                                    <Typography variant="subtitle1" component="div">
                                        {`Tezos ${getItemName(
                                            apiKeys[selectedKey].environment
                                        )} Node`}
                                    </Typography>
                                    {mainUrls[apiKeys[selectedKey].environment].tezos.map( url =>
                                    <Grid container alignItems="center">                                        
                                        <LinkText>
                                            {url}
                                        </LinkText>
                                        <CopyButton
                                            txt={url}
                                        />                              
					      {apiKeys[selectedKey].environment === "dev" && (
						<Typography>
						  {url.includes("jakarta")
						    ? "(jakartanet)"
						    : "(ithacanet)"}
						</Typography>
					      )}
                                    </Grid>
                                    )}
                                </Grid>
                                    
                                <Grid item>
                                    <Typography variant="subtitle1" component="div">
                                        {`Conseil ${getItemName(
                                            apiKeys[selectedKey].environment
                                        )} Node`}
                                    </Typography>
                                    {mainUrls[apiKeys[selectedKey].environment].conseil.map(url =>
                                    <Grid container alignItems="center">
                                        <LinkText>
                                            {url}
                                        </LinkText>
                                        <CopyButton
                                            txt={url}
                                        />
 						{apiKeys[selectedKey].environment === "dev" && (
						  <Typography>
						    {url.includes("jakarta")
						      ? "(jakartanet)"
						      : "(ithacanet)"}
						  </Typography>
						)}
                                    </Grid>
                                    )}
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" component="div">
                                        API Key
                                    </Typography>
                                    <LinkBox container alignItems="center">
                                        <ApiKeyText>{apiKeys[selectedKey].key}</ApiKeyText>
                                        <CopyButton
                                            txt={apiKeys[selectedKey].key}
                                            margin="0 0 0 auto"
                                        />
                                        <CustomImg
                                            src={refreshIcon}
                                            size="0.9375rem"
                                            margin="0 0 0 auto"
                                            name="refresh-icon"
                                            onClick={() => setOpen(true)}
                                        />
                                    </LinkBox>
                                </Grid>
                            </Grid>
                        </DetailsBg>
                    </Details>
                )}
                <Resources item>
                    <TitleText>Resources to get Started</TitleText>
                    <ResourcesLinksContainer container alignItems="center">
                        <ResourcesLinkItem item onClick={() => openUrl(handbook)}>
                            <CustomImg src={bookIcon} size="4.5rem" name="book-icon" />
                            <ResourcesLinks variant="subtitle1">
                                Tezos Developers' Handbook
                            </ResourcesLinks>
                        </ResourcesLinkItem>
                        <ResourcesLinkItem item onClick={() => openUrl(conseil)}>
                            <CustomImg src={scriptIcon} size="4.5rem" name="script-icon" />
                            <ResourcesLinks variant="subtitle1">
                                Conseil Documentation
                            </ResourcesLinks>
                        </ResourcesLinkItem>
                        <ResourcesLinkItem item onClick={() => openUrl(conseiljs)}>
                            <CustomImg
                                src={programmingIcon}
                                size="4.5rem"
                                name="programming-icon"
                            />
                            <ResourcesLinks variant="subtitle1">
                                Conseil.JS Documentation
                            </ResourcesLinks>
                        </ResourcesLinkItem>
                    </ResourcesLinksContainer>
                </Resources>
            </Main>
            {open && (
                <Modal open={open} onClose={onClose}>
                    <ModalTitle id="customized-dialog-title" disableTypography>
                        Create New API Key
                    </ModalTitle>
                    <ModalDivider />
                    <ModalContent>
                        <ModalAskText>Are you sure you want to create a new API key?</ModalAskText>
                        <ModalInfoText>{`Proceeding will immediately revoke access for your current key in the ${getItemName(
                            apiKeys[selectedKey].environment
                        ).toUpperCase()} environment. This cannot be undone.`}</ModalInfoText>
                    </ModalContent>
                    <ModalActionsWrapper>
                        <ModalButtonCancel onClick={onClose}>Cancel</ModalButtonCancel>
                        <ModalButtonAccept
                            onClick={() =>
                                refreshKeys(apiKeys[selectedKey].environment, selectedKey)
                            }
                        >
                            Yes
                        </ModalButtonAccept>
                    </ModalActionsWrapper>
                </Modal>
            )}
        </>
    );
};

export default Keys;
