import React from 'react';
import {Form, Modal, Spinner} from 'react-bootstrap';
import './StyledModal.css'


const StyledModal: React.FC<{ show: boolean, setShow: (show: boolean) => void, class?: string, data?: any, isFetching: boolean, setSkip?: (skip: boolean) => void}> = (props) => {
    let form = <Spinner animation="border" />
    if (!props.isFetching) {
        form = (
            <Form>
                <div className="form-row view-form">
                    <Form.Group className="col-md-6">
                        <Form.Label>Customer</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.customer} />
                    </Form.Group>

                    <Form.Group className="col-md-6">
                        <Form.Label>Vehicle</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.vehicle} />
                    </Form.Group>

                    <Form.Group className="col-md-6">
                        <Form.Label>Issue Date</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.issueDate} />
                    </Form.Group>

                    <Form.Group className="col-md-6">
                        <Form.Label>Return Date</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.returnDate} />
                    </Form.Group>

                    <Form.Group className="col-md-6">
                        <Form.Label>SON#</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.SON} />
                    </Form.Group>
                    <Form.Group className="col-md-6">
                        <Form.Label>Book#</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.book} />
                    </Form.Group>

                    <Form.Group className="col-md-4">
                        <Form.Label>Advance Amount</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.advanceAmount} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Balance</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.balance} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Tariff</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.tariff} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Rental Type</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.rentalType} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Payment Type</Form.Label>
                        <Form.Control className={'text_input'} disabled type={'text'} value={props.data.paymentType} />
                    </Form.Group>
                </div>
            </Form>
        )
    }
    return (
        <Modal show={props.show}>
            <Modal.Header className={'modal-header'}>
                Actions
                <button onClick={() => {
                    props.setShow(false)
                    if(props.setSkip)  props.setSkip(true)

                }}>X</button>
            </Modal.Header>
            <Modal.Body className={props.class}>
                { form }
            </Modal.Body>
        </Modal>
    );
};

export default StyledModal;
