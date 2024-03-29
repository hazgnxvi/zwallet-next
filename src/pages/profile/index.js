import { useState } from 'react'
import MenuHome from 'src/commons/components/MenuHome'
import Layout from 'src/commons/components/Layout'
import styles from 'src/commons/styles/profile.module.css'
import photoDefault from 'src/assets/img/profile-default.png'
import Swal from 'sweetalert2'

import { Button, Modal } from 'react-bootstrap'

import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { personalUser } from 'src/redux/actions/user'
import { addChangePhotoUser } from 'src/modules/utils/users'

const Profile = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const router = useRouter()
    const { token, id } = state.auth.userData
    const { userData } = state.user
    const { image, firstName, lastName, noTelp } = userData

    const [isModal, setIsmodal] = useState(false)

    const [showImg, setShowImg] = useState(!image ? photoDefault : `${process.env.NEXT_PUBLIC_IMAGE_USER}/${image}`)
    const [fileImg, setFileImg] = useState('')

    const onLogout = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: true
        })

        swalWithBootstrapButtons.fire({
            title: 'Are you sure you want to log out?',
            text: "You can log back in at any time!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout!',
            cancelButtonText: 'cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Logout!',
                    'Logout Successful',
                    'success'
                )
                setTimeout(() => {
                    router.replace('/logout')
                }, 3000);
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Enjoy again :)',
                )
            }
        })
    }

    const imageHandler = (e) => {
        const img = e.target.files[0]
        setShowImg(URL.createObjectURL(img))
        setFileImg(img)
        setIsmodal(!isModal)
    }

    const confirmHandler = () => {
        const body = new FormData()
        body.append('image', fileImg)

        setIsmodal(!isModal)

        addChangePhotoUser(id, body, token)
            .then((res) => {
                Swal.fire({
                    title: 'Successed',
                    text: res.data.msg,
                    icon: 'success'
                })
                dispatch(personalUser(id, token))
            }).catch(({ ...err }) => {
                Swal.fire({
                    title: 'There an Error?',
                    text: err.response.data.msg,
                    icon: 'error'
                })
            })
    }

    return (
        <>
            <Layout title='Zwallet - Profile'>
                <MenuHome>
                    <main className={`${styles['box']}`}>
                        <section className={`d-flex justify-content-center`}>
                            <div className='mt-5'>
                                <div className={`${styles['photo-profile']}`}>
                                    <Image src={showImg}
                                        alt='avatar' width='52' height='52' objectFit='cover' className={`${styles['radius-photo']}`} onError={(e) => {
                                            e.currentTarget.onerror = null
                                            setShowImg(photoDefault)
                                        }} />
                                </div>
                                <label className={styles['edit-text']} htmlFor="file-input">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi mx-2 bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                    </svg>
                                    edit
                                </label>
                                <input type={'file'} id='file-input' style={{ display: 'none' }} onChange={e => imageHandler(e)} />
                            </div>
                        </section>
                        <section className='text-center'>
                            <p className='h5'>{`${firstName} ${lastName}`}</p>
                            <p className='text-secondary'>{!noTelp ? 'no phone number' : noTelp}</p>
                        </section>

                        <section className='pt-5 text-center'>
                            <div className='d-flex justify-content-center'>
                                <div className={styles['box-info']} onClick={() => { router.push('/personal/information') }}>
                                    <p>Personal Information</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi mt-2 bi-arrow-right" viewBox="0 0 16 16">
                                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className='d-flex mt-4 justify-content-center'>
                                <div className={styles['box-info']} onClick={() => { router.push('/change-password') }}>
                                    <p>Change Password</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi mt-2 bi-arrow-right" viewBox="0 0 16 16">
                                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className='d-flex mt-4 justify-content-center'>
                                <div className={styles['box-info']} onClick={() => { router.push('/change-pin') }}>
                                    <p>Change Pin</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi mt-2 bi-arrow-right" viewBox="0 0 16 16">
                                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className='d-flex mt-4 pb-5 justify-content-center'>
                                <div className={styles['box-info']} onClick={onLogout}>
                                    <p>Logout</p>
                                </div>
                            </div>
                        </section>
                    </main>
                </MenuHome>

                <Modal show={isModal} onHide={() => { setIsmodal(!isModal) }} size='xl' aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {!image ? 'Are You Sure Add Photo?' : 'Are You Sure Change Photo?'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Click Confirm for Accept
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-secondary' onClick={() => { setIsmodal(!isModal) }}>Cancel</Button>
                        <Button onClick={confirmHandler}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        </>
    )
}

export default Profile
