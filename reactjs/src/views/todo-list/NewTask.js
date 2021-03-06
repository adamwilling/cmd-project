import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Modal, Button } from "react-bootstrap"
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io"
import { Spinner } from 'react-bootstrap'
import { FaUserAlt } from "react-icons/fa";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CgAttachment } from "react-icons/cg"
import DateInput from "./DateInput";
import * as todoListAction from "../../actions/todoListAction"
import "../../../node_modules/@ckeditor/ckeditor5-editor-classic/theme/classiceditor.css"
const editorConfiguration = {
    heading: {
        options: [
            { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
            { model: 'heading3', view: 'h3', title: 'Heading 1', class: 'ck-heading_heading3' },
            { model: 'heading2', view: 'h1', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading1', view: 'h2', title: 'Heading 3', class: 'ck-heading_heading1' },
            // {
            // 	model: 'headingFancy',
            // 	view: {
            // 		name: 'h2',
            // 		classes: 'fancy'
            // 	},
            // 	title: 'Heading 2 (fancy)',
            // 	class: 'ck-heading_heading2_fancy',
            // 	converterPriority: 'high'
            // }
        ]
    }
}
const NewTask = (props) => {
    const [showListEmployees, setShowListEmployees] = useState(false)
    const [showListEmployeesInvolve, setShowListEmployeesInvolve] = useState(false)
    const [showDateStart, setShowDateStart] = useState(false)
    const [showDateEnd, setShowDateEnd] = useState(false)
    const [employee, setEmployee] = useState("")
    const [showRepeatUnit, setShowRepeatUnit] = useState(false)
    const [levelPrioritize, setLevelPrioritize] = useState(0)
    const [daysOfWeek, setDaysOfWeek] = useState([])
    const [showDaysOfMonth, setShowDaysOfMonth] = useState(false)
    // const [showDaysOfWeek, setShowDaysOfWeek] = useState(false)
    const [showOrder, setShowOrder] = useState(false)
    const [showMomments, setShowMomments] = useState(false)
    const [repeatUnit, setRepeatUnit] = useState("Ng??y")
    const startNewDateTask = useSelector(state => state.TodoListReducer.startDateNewTask)
    const endNewDateTask = useSelector(state => state.TodoListReducer.endDateNewTask)
    const listEmployeeSearch = useSelector(state => state.TodoListReducer.listEmployeeSearch)
    const wrapperRef = useRef(null)
    const inputEplsRef = useRef(null)
    const dispacth = useDispatch()
    //set color prioritize level 
    const setColorPrioritizeLevel = (index) => {
        const arrayColor = ["#2F6BB1", "#0DD2DE", "#3CEBC1", "#75FFD6"]
        const nameLev = ["Th???p", "B??nh th?????ng", "??u ti??n", "R???t ??u ti??n"]
        let els = []
        for (let i = 0; i <= index; i++) {
            els.push(<div key={i} className="col-sm-3 d-flex flex-column w-25">
                <button style={{ backgroundColor: i <= levelPrioritize ? arrayColor[i] : null, borderColor: i <= levelPrioritize ? arrayColor[i] : null }} onClick={() => setLevelPrioritize(i)} className="btn btn-outline-primary w-100"></button>
                <span className="text-center fs-5">{nameLev[i]}</span>
            </div>)
        }
        if (index < arrayColor.length) {
            for (let i = index + 1; i < arrayColor.length; i++) {
                els.push(<div key={i} className="col-sm-3 d-flex flex-column w-25">
                    <button style={{ backgroundColor: i <= levelPrioritize ? arrayColor[i] : null }} onClick={() => setLevelPrioritize(i)} className="btn btn-outline-primary w-100"></button>
                    <span className="text-center fs-5">{nameLev[i]}</span>
                </div>)
            }
        }
        return els.map((item) => item)
    }
    //processing actions of components select list dropdown with input
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowListEmployees(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    //search employees
    const searchEmployees = (e) => {
        const params = ["SEARCH_EMPLOYEES", { object: "employees", contain: "name_like", key: e.target.value }]
        dispacth(todoListAction.search(params))
    }
    //change days of week
    const changeDaysOfWeek = (dow) => {
        let newDaysOfWeek = [];
        if (daysOfWeek.includes(dow)) {
            for (let i = 0; i < daysOfWeek.length; i++) {
                if (daysOfWeek[i] === dow) {
                    continue;
                }
                newDaysOfWeek.push(daysOfWeek[i])
            }
        } else {
            for (let i = 0; i < daysOfWeek.length; i++) {
                newDaysOfWeek.push(daysOfWeek[i])
            }
            newDaysOfWeek.push(dow)
        }
        setDaysOfWeek(newDaysOfWeek)
    }
    //render days of week
    const renderOfWeek = () => {
        const arrayDaysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
        let r = []
        for (let i = 0; i < arrayDaysOfWeek.length; i++) {
            if (daysOfWeek.includes(arrayDaysOfWeek[i])) {
                r.push(<div key={i} className="col-sm">
                    <button onClick={() => changeDaysOfWeek(arrayDaysOfWeek[i])} style={{ width: "35px", height: "35px" }} className="btn btn-outline-primary rounded-circle p-1 active">{arrayDaysOfWeek[i]}</button>
                </div>)
            } else {
                r.push(<div key={i} className="col-sm">
                    <button onClick={() => changeDaysOfWeek(arrayDaysOfWeek[i])} style={{ width: "35px", height: "35px" }} className="btn btn-outline-primary rounded-circle p-1">{arrayDaysOfWeek[i]}</button>
                </div>)
            }
        }
        return r.map(item => item)
    }
    //render days of month
    const renderOfMonth = () => {
        let els = []
        for (let index = 1; index < 31; index++) {
            els.push(index)
        }
        return els.map((item, id) => <li key={id} className="list-group-item list-group-item-action">{item}</li>)
    }
    //render moments 
    const renderMoments = () => {
        return ["M???i ng??y", "Th??? Hai", "Th??? Ba", "Th??? T??", "Th??? N??m", "Th??? S??u", "Th??? B???y",
            "Ch??? Nh???t", "C??c Ng??y Trong Tu??n", "Ng??y Cu???i Tu???n"].map((item, id) => <li key={id} className="list-group-item list-group-item-action">{item}</li>)
    }
    //render order
    const renderOrder = () => {
        return ["?????u ti??n", "Th??? 2", "Th??? 3", "Th??? 4", "Cu???i c??ng"].map((item, id) => <li key={id} className="list-group-item list-group-item-action">{item}</li>)
    }
    //render repeat by unit
    const renderRepeatByUnit = () => {
        switch (repeatUnit) {
            case "Ng??y": return null
            case "Tu???n": return renderOfWeek()
            case "Th??ng": {
                return <>
                    <div className="col-sm-3">
                        <div className="mb-3">
                            <input style={{ width: "15px", height: "15px" }} className="mx-auto" type={"radio"} name={"moment"} id="1" defaultValue={"id1"}></input>
                            <label for="1" style={{ whiteSpace: "nowrap" }} className="fw-bold ps-1">V??o ng??y</label>
                        </div>
                        <div className="mt-3">
                            <input style={{ width: "15px", height: "15px" }} className="mx-auto" type={"radio"} name={"moment"} id="2" defaultValue={"id2"}></input>
                            <label for="2" style={{ whiteSpace: "nowrap" }} className="fw-bold ps-1">V??o th???i ??i???m</label>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div className="w-50 mb-3 position-relative">
                            <div className="col d-flex form-control p-0 ps-2" onClick={() => setShowDaysOfMonth(!showDaysOfMonth)}>
                                <input placeholder="Ch???n ng??y" style={{ border: "none", outline: "none" }} className={"w-100 p-0"}></input>
                                <IoMdArrowDropdown size={20} />
                            </div>
                            {
                                showDaysOfMonth ?
                                    <ul className="list-group position-absolute top-100 start-0 bg-primary w-100 rounded" style={{ overflowY: "scroll", maxHeight: "200px" }}>
                                        {renderOfMonth()}
                                    </ul>
                                    : null
                            }
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <div className="d-flex form-control position-relative me-3 w-100" onClick={() => setShowMomments(!showMomments)}>
                                <input placeholder="Ch???n ng??y" style={{ border: "none", outline: "none" }} className={"w-100 p-0"}></input>
                                <IoMdArrowDropdown size={20} />
                                {showMomments ?
                                    <ul className="list-group position-absolute top-100 start-0 bg-primary w-100 rounded" style={{ overflowY: "scroll", maxHeight: "200px" }}>
                                        {renderMoments()}
                                    </ul>
                                    : null}
                            </div>
                            <div className="d-flex form-control position-relative w-100" onClick={() => setShowOrder(!showOrder)}>
                                <input placeholder="Ch???n th??? t???" style={{ border: "none", outline: "none" }} className={"w-100 p-0"}></input>
                                <IoMdArrowDropdown size={20} />
                                {showOrder ?
                                    <ul className="list-group position-absolute top-100 start-0 bg-primary w-100 rounded" style={{ overflowY: "scroll", maxHeight: "200px" }}>
                                        {renderOrder()}
                                    </ul>
                                    : null}
                            </div>
                        </div>
                    </div>
                </>
            }
        }
    }
    return (
        <>
            <Modal scrollable
                {...props}
                size="lg    "
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" >
                        <h3 className="text-center fw-bold">T???O M???I C??NG VI???C</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="row ms-5 me-5 mb-2">
                            <span className="fw-bold pe-0 ps-0 fs-4">T??n c??ng vi???c</span>
                            <div className="d-flex form-control">
                                <input style={{ border: "none", outline: "none" }} className={"ps-2 w-100 text-blue"}></input>
                            </div>
                        </div>
                        <div className="row ms-5 me-5 mb-2 position-relative">
                            <span className="fw-bold pe-0 ps-0 fs-4">Ng?????i ???????c giao</span>
                            <div className="d-flex form-control rounded-top" onClick={() => setShowListEmployees(!showListEmployees)} >
                                <input value={employee} ref={inputEplsRef} type={"search"} onChange={searchEmployees} style={{ border: "none", outline: "none" }} className={"ps-2 w-100"}></input>
                                <IoMdArrowDropdown size={20} />
                                {/* <Spinner size="sm"
                                    animation="border"
                                    variant="primary"
                                /> */}
                            </div>
                            {
                                showListEmployees ?

                                    <ul ref={wrapperRef} className="list-group pe-0 position-absolute position-absolute top-100 start-0 bg-white" role={"listbox"} style={{ overflowY: "auto", maxHeight: listEmployeeSearch.length === 0 ? "40px" : "200px" }}>
                                        {listEmployeeSearch.length === 0 ? <li role={"option"} className="list-group-item list-group-item-action disabled">
                                            H??y nh???p t??n nh??n vi??n c???a b???n
                                        </li> : listEmployeeSearch.map((item, id) => <li onClick={() => setEmployee(item.display_name)} key={id} role={"option"} className="list-group-item list-group-item-action">
                                            <span className="mx-auto text-blue"> <FaUserAlt size={15} className="me-2" /> </span> {item.display_name}
                                        </li>)}
                                    </ul>
                                    : null
                            }
                        </div>
                        <div className="row ms-5 me-5 justify-content-md-center">
                            <span className="fw-bold pe-0 ps-0 fs-4">M???c ????? ??u ti??n</span>
                            <div className="row d-flex flex-wrap p-0">
                                {setColorPrioritizeLevel(levelPrioritize)}
                            </div>
                        </div>
                        <div className="row ms-5 me-5 mb-2">
                            <span className="fw-bold pe-0 ps-0 fs-4">M?? t???</span>
                            <div className="p-0" >
                                <div id="editor" >
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data="<p>Hello from CKEditor 5!</p>"
                                        config={editorConfiguration}
                                        onReady={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            // console.log('Editor is ready to use!', editor);
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            // console.log({ event, editor, data });
                                        }}
                                        onBlur={(event, editor) => {
                                            // console.log('Blur.', editor);
                                        }}
                                        onFocus={(event, editor) => {
                                            // console.log('Focus.', editor);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row ms-5 me-5 mb-2">
                            <div className="col-sm p-2">
                                <span className="col-5 fw-bold p0 mb-2 fs-4">Th???i gian t??? ng??y</span>
                                <div className="col d-flex form-control p-0 ps-2" onClick={() => setShowDateStart(!showDateStart)}>
                                    <input readOnly value={startNewDateTask == null ? "" : startNewDateTask} style={{ border: "none", outline: "none" }} className={"w-100 p-0 text-blue"}></input>
                                </div>
                            </div>
                            <div className="col-sm p-2" >
                                <span className="fw-bold pe-0 ps-0 mb-2 fs-4">?????n ng??y</span>
                                <div className="col d-flex form-control p-0 ps-2" onClick={() => setShowDateEnd(!showDateEnd)}>
                                    <input readOnly value={endNewDateTask == null ? "" : endNewDateTask} style={{ border: "none", outline: "none" }} className={"w-100 p-0 text-blue"}></input>
                                </div>
                            </div>
                        </div>
                        <div className="row ms-5 me-5 mb-2">
                            <div className="row d-flex flex-col">
                                <div className="col-sm d-flex flex-col me-2">
                                    <div className="d-flex flex-row me-2">
                                        <input style={{ width: "15px", height: "15px", margin: "auto" }} className="mx-auto" type={"radio"}></input>
                                        <label style={{ whiteSpace: "nowrap", margin: "auto" }} className="fw-bold ps-1 fs-4">L???p l???i</label>
                                    </div>
                                    <span className="ms-2 w-100">
                                        <input className="form-control w-100 p-1" placeholder="Nh???p s??? l???n" type={"text"} />
                                    </span>
                                </div>
                                <div className="col-sm d-flex flex-col ms-2 w-100">
                                    <label className="fw-bold me-2 fs-4">tr??n</label>
                                    <div className="d-flex flex-column">
                                        <div className="d-flex flex-row form-control w-100 p-1" onClick={() => setShowRepeatUnit(!showRepeatUnit)}>
                                            <input value={repeatUnit} onChange={setRepeatUnit} style={{ border: "none", outline: "none" }} className={"ps-2 w-100 text-blue"}></input>
                                            <IoMdArrowDropdown className={`${showRepeatUnit ? "rolated-top" : "rolated-bottom"}`} size={25} />
                                        </div>
                                        {showRepeatUnit ?
                                            <div className="position-relative bg-white">
                                                <div className="d-flex flex-row position-absolute top-0 start-0 w-100 border border-primary translation">
                                                    <ul className="list-group w-100" style={{ border: "none" }}>
                                                        <li className="list-group-item list-group-item-action" onClick={() => setRepeatUnit("Ng??y")}>Ng??y</li>
                                                        <li className="list-group-item list-group-item-action" onClick={() => setRepeatUnit("Tu???n")}>Tu???n</li>
                                                        <li className="list-group-item list-group-item-action" onClick={() => setRepeatUnit("Th??ng")}>Th??ng</li>
                                                        <li className="list-group-item list-group-item-action" onClick={() => setRepeatUnit("N??m")}>N??m</li>
                                                    </ul>
                                                    {/* <div className="d-flex flex-column-reverse bg-white">
                                                        <div ><IoMdArrowDropup size={20} className={`${showRepeatUnit ? "rolated-top" : "rolated-bottom"}`} /></div>
                                                    </div> */}
                                                </div>
                                            </div>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex flex-col ms-5 me-5 mb-4">
                            {renderRepeatByUnit()}
                        </div>
                        <div className="row d-flex flex-col ms-5 me-5 mb-2">
                            <div className="col-sm d-flex flex-col me-2">
                                <div className="d-flex flex-row me-2">
                                    <input style={{ width: "15px", height: "15px", margin: "auto", color: "#2F6BB1" }} className="mx-auto fs-4" type={"radio"}></input>
                                    <label style={{ whiteSpace: "nowrap", margin: "auto" }} className="fw-bold ps-1 text-break fs-4">C??ng vi???c con th???c hi???n tu???n t???</label>
                                </div>
                            </div>
                        </div>
                        <div className="row ms-5 me-5 mb-2 mt-3">
                            <div className="col-sm p-2 position-relative">
                                <span className="col-5 fw-bold p0 mb-2 fs-4">?????i t?????ng li??n quan</span>
                                <div className="col d-flex form-control p-0 ps-2" onClick={() => setShowListEmployeesInvolve(!showListEmployeesInvolve)}>
                                    <input type={"search"} onChange={searchEmployees} style={{ border: "none", outline: "none", color: "#2F6BB1" }} className={"w-100 p-0 ps-1 pe-2"}></input>
                                </div>
                                {
                                    showListEmployeesInvolve ?

                                        <ul ref={wrapperRef} className="list-group pe-0 position-absolute position-absolute top-100 start-0 bg-white" role={"listbox"} style={{ overflowY: "scroll", maxHeight: listEmployeeSearch.length === 0 ? "40px" : "200px" }}>
                                            {listEmployeeSearch.length === 0 ? <li role={"option"} className="list-group-item list-group-item-action disabled">
                                                H??y nh???p t??n nh??n vi??n c???a b???n
                                            </li> : listEmployeeSearch.map((item, id) => <li key={id} role={"option"} className="list-group-item list-group-item-action">
                                                <span className="mx-auto"> <FaUserAlt size={15} className="me-2" /> </span> {item.display_name}
                                            </li>)}
                                        </ul>
                                        : null
                                }
                                <ul className="p-3">
                                    <li>C?? th??? nh???p m?? ho???c t??n c???a ????? xu???t /thi???t b???/ c??ng vi???c/ nh??n vi??n/ ch???c v???/ ph??ng ban</li>
                                    <li>C?? th??? ch???n nhi???u ?????i t?????ng</li>
                                </ul>
                            </div>
                            <div className="col-sm p-2" >
                                <span className="fw-bold pe-0 ps-0 mb-2 fs-4">M???u b??o c??o</span>
                                <div className="col d-flex form-control p-0 ps-2" >
                                    <input type="search" style={{ border: "none", outline: "none" }} className={"w-100 p-0 ps-1 pe-2"}></input>
                                </div>
                                <div className="pt-3 d-flex flex-row">
                                    <h3 className="fw-bold">????nh k??m: </h3>
                                    <span style={{ width: "20px", height: "30px" }} className="border border-warning">
                                        <label htmlFor="file-input">
                                            <CgAttachment size={30} />
                                        </label>

                                        <input onChange={(e) => console.log(e.target.files[0])} style={{ display: "none" }} id="file-input" type="file" />
                                    </span>

                                    {/* <label for="file-input">
                                        <img src="https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/128/Downloads-icon.png" />
                                    </label>

                                    <input style={{ display: "none" }} id="file-input" type="file" /> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>L??u v?? t???o m???i</Button>
                    <Button onClick={props.onHide}>L??u</Button>
                </Modal.Footer>
            </Modal>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <DateInput typenamedate={"START_DATE_NEW_TASK"} show={showDateStart} onHide={() => setShowDateStart(false)} />
                <DateInput typenamedate={"END_DATE_NEW_TASK"} show={showDateEnd} onHide={() => setShowDateEnd(false)} />
            </div>
        </>

    )

}
export default NewTask
