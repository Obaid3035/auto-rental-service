import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import {NavLink} from "react-router-dom";
import {Button, Form, Modal} from "react-bootstrap";
import { useSpring, animated } from 'react-spring';
import { alpha, styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import {Collapse} from "@mui/material";
import {useFetchVehiclesQuery, useUpdateVehicleMutation} from "../../../redux/apiSlice";
import './Vehicle.css'
import {errorNotify} from "../../../utils/toast";
import DisplayError from "../../../component/DisplayError/DisplayError";
import OverLaySpinner from "../../../lib/Spinner/Spinner";


interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
}

const Vehicle = () => {

    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [name, setName] = React.useState('')
    const [show, setShow] = React.useState(false);

    const {data = [], isFetching, error, isError} = useFetchVehiclesQuery(null);

    const [updateVehicle, {isLoading}] = useUpdateVehicleMutation();

    if (isLoading) {
        return <OverLaySpinner isActive={isLoading}/>
    }


    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateVehicle({ id: selected, data: name})
        setShow(!show);
        setName('');
    }

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setSelected(nodeIds);
    };


    function MinusSquare(props: SvgIconProps) {
        return (
            <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
                <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
            </SvgIcon>
        );
    }

    function PlusSquare(props: SvgIconProps) {
        return (
            <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
                <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
            </SvgIcon>
        );
    }

    const StyledTreeItem = styled((props: TreeItemProps) => (
        <TreeItem {...props} TransitionComponent={TransitionComponent} />
    ))(({ theme }) => ({
        [`& .${treeItemClasses.iconContainer}`]: {
            '& .close': {
                opacity: 0.3,
            },
        },
        [`& .${treeItemClasses.group}`]: {
            marginLeft: 15,
            paddingLeft: 18,
            borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
        },
    }));


    function TransitionComponent(props: TransitionProps) {
        const style = useSpring({
            from: {
                opacity: 0,
                transform: 'translate3d(20px,0,0)',
            },
            to: {
                opacity: props.in ? 1 : 0,
                transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
            },
        });

        return (
            <animated.div style={style}>
                <Collapse {...props} />
            </animated.div>
        );
    }


    const renderTree = (data: RenderTree[]) => {
        return data.map((root: RenderTree) => (
            <StyledTreeItem key={root.id} nodeId={root.id} label={root.name}>
                {
                    root.children && Array.isArray(root.children) ?
                        root.children.map((child: RenderTree) => (
                            <StyledTreeItem key={child.id} nodeId={child.id} label={child.name}>
                                {
                                    child.children && Array.isArray(child.children) ?
                                        child.children.map((nestedChild: RenderTree) => (
                                           <StyledTreeItem key={nestedChild.id} nodeId={nestedChild.id} label={nestedChild.name}/>
                                        ))
                                        : null
                                }
                            </StyledTreeItem>
                        ))
                        : null
                }
            </StyledTreeItem>
        ))
    }



    const modal = (
        <Modal show={show}>
            <Modal.Header className="modal-header">
                Edit Vehicle
                <button onClick={() => {
                    setShow(false)
                }}>X</button>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmitHandler}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control onChange={(e) => setName(e.target.value)} value={name} required type="text" />
                    </Form.Group>
                    <button type={'submit'} className={'py-2 px-3 my-3'}>Update</button>
                </Form>
            </Modal.Body>
        </Modal>
    )


    if (isError && error && 'data' in error) {
        if (error && error.data && (error as any).data.message) {
            errorNotify((error as any).data.message)
        } else {
            return <DisplayError error={error}/>
        }
    }


    let treeView = <OverLaySpinner isActive={isFetching}/>

    if (!isFetching) {
        treeView = (
            <div className={'page_responsive'}>
                { modal }
                <div className={'header'}>
                    <h5>Vehicles</h5>
                    <div>
                        <NavLink to={'/create-vehicle'}>
                            <button className={'px-4 py-2 mb-3'} >+ Add Vehicle</button>
                        </NavLink>
                    </div>
                </div>
                <div className={'vehicle_tree_view'}>
                    <Button className={'float-right edit__btn'} disabled={Array.isArray(selected)} onClick={() => setShow(true)}>Edit</Button>

                    {
                        data.length > 0 ?
                            <TreeView
                                aria-label="controlled"
                                defaultCollapseIcon={<MinusSquare />}
                                defaultExpandIcon={<PlusSquare />}
                                title={'Vehicle'}
                                expanded={expanded}
                                selected={selected}
                                onNodeToggle={handleToggle}
                                onNodeSelect={handleSelect}
                            >
                                {
                                    renderTree(data)
                                }
                            </TreeView>
                            : <p className={'text-muted text-center'}>No Vehicle Found</p>
                    }
                </div>
            </div>
        )
    }

    return treeView
};

export default Vehicle;
