;; Training Certification Contract
;; Verifies completion of required courses

;; Define data variables
(define-data-var admin principal tx-sender)
(define-map training-courses
  { id: uint }
  {
    name: (string-utf8 100),
    description: (string-utf8 500),
    hours-required: uint,
    active: bool
  }
)

(define-map completed-trainings
  { firefighter-id: uint, course-id: uint }
  {
    completion-date: uint,
    instructor: (string-utf8 100),
    score: uint,
    certificate-hash: (buff 32)
  }
)

(define-data-var next-course-id uint u1)

;; Public functions
(define-public (add-training-course (name (string-utf8 100))
                                   (description (string-utf8 500))
                                   (hours-required uint))
  (let ((new-id (var-get next-course-id)))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set training-courses
          { id: new-id }
          {
            name: name,
            description: description,
            hours-required: hours-required,
            active: true
          }
        )
        (var-set next-course-id (+ new-id u1))
        (ok new-id)
      )
      (err u403)
    )
  )
)

(define-public (record-training-completion (firefighter-id uint)
                                          (course-id uint)
                                          (instructor (string-utf8 100))
                                          (score uint)
                                          (certificate-hash (buff 32)))
  (if (is-eq tx-sender (var-get admin))
    (begin
      (map-set completed-trainings
        { firefighter-id: firefighter-id, course-id: course-id }
        {
          completion-date: block-height,
          instructor: instructor,
          score: score,
          certificate-hash: certificate-hash
        }
      )
      (ok true)
    )
    (err u403)
  )
)

(define-public (update-course-status (course-id uint) (active bool))
  (let ((course (unwrap! (map-get? training-courses { id: course-id }) (err u404))))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set training-courses
          { id: course-id }
          (merge course { active: active })
        )
        (ok true)
      )
      (err u403)
    )
  )
)

;; Read-only functions
(define-read-only (get-training-course (id uint))
  (map-get? training-courses { id: id })
)

(define-read-only (get-completed-training (firefighter-id uint) (course-id uint))
  (map-get? completed-trainings { firefighter-id: firefighter-id, course-id: course-id })
)

(define-read-only (is-certified (firefighter-id uint) (course-id uint))
  (is-some (map-get? completed-trainings { firefighter-id: firefighter-id, course-id: course-id }))
)
