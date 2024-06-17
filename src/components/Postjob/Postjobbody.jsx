import { useState, useRef } from 'react'
import styles from '../GdforEmployers/EmployersBody.module.css';
import { ModalPage } from '../Modal/Modal';

export function Postjobbody() {
    const [data, setData] = useState({
        company: '',
        jobProfile: '',
        location: '',
        salaryRange: '3L-5L',
        prerequisite: '',
        imgUrl: ''
    });
    const [fileName, setFileName] = useState("");
    const logoRef = useRef();
    const [modalStatus, setModalStatus] = useState({
        isOpen: false,
        messege: ""
    });

    const handleHideModal = () => {
        setTimeout(() => {
            setModalStatus({ ...modalStatus, isOpen: false, messege: "" });
        }, 3000);
    };

    const extractValue = (str) => {
        let idx = str.lastIndexOf("\\");
        return str.slice(idx + 1);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "imgUrl" && files.length > 0) {
            setFileName(extractValue(e.target.value));
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);

            reader.onload = (e) => {
                setData({ ...data, imgUrl: e.target.result });
            };
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const getRating = () => {
            let rating = 0;
            while (rating < 3) {
                rating = (Math.random() * 5).toFixed(1);
            }
            return rating;
        };

        data.rating = getRating();

        try {
            const response = await fetch('https://glassdoor-backend.vercel.app/api/jobs/postjob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setModalStatus({ ...modalStatus, isOpen: true, messege: "Job posted successfully!" });
            } else {
                setModalStatus({ ...modalStatus, isOpen: true, messege: "Error posting job!" });
            }
        } catch (err) {
            console.log(err);
            setModalStatus({ ...modalStatus, isOpen: true, messege: "Error posting job!" });
        }

        handleHideModal();
    };

    return (
        <div>
            <ModalPage isOpen={modalStatus.isOpen} messege={modalStatus.messege} />
            <div className={styles.body_top}></div>
            <div className={styles.form_outer}>
                <div className={styles.form_container}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label>
                            Company Name <br />
                            <input onChange={handleChange} type="text" name="company" required /><br />
                        </label>
                        <label>
                            Job Profile <br />
                            <input onChange={handleChange} type="text" name="jobProfile" required /><br />
                        </label>
                        <label>
                            Location <br />
                            <input onChange={handleChange} type="text" name="location" required /><br />
                        </label>
                        <label>
                            Salary Range<br />
                            <select className={styles.salaryRangeSelect} onChange={handleChange} name="salaryRange" required>
                                <option value="3L-5L">3L-5L</option>
                                <option value="5L-10L">5L-10L</option>
                                <option value="10L-15L">10L-15L</option>
                            </select><br />
                        </label>
                        <label className={styles.imgIcon}>
                            Select Logo <i className="fas fa-images"></i> <br />
                            <input className={styles.uploadBtn} type="text" readOnly placeholder="Upload File" onClick={() => logoRef.current.click()} /> <br />
                        </label>
                        <p className={styles.chosenFile}>{fileName}</p>
                        <input style={{ display: 'none' }} onChange={handleChange} ref={logoRef} type="file" name="imgUrl" id={styles.chooselogo} />
                        <h3>Prerequisites</h3>
                        <textarea className={styles.prerequisite} name="prerequisite" cols="30" rows="10" onChange={handleChange} required></textarea>
                        <button type="submit">Post Job</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
