/// Module: proof_of_learning
/// This module implements the Proof of Learning Ledger - a certificate NFT system
/// that mints NFT badges when learners complete courses.
#[allow(duplicate_alias)]
module proof_of_learning::certificate {
    use std::string::{Self, String};
    use iota::event;
    use iota::package;
    use iota::display;
    use iota::transfer;
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};

    /// Error codes
    const ENotAllModulesCompleted: u64 = 0;
    const EModuleAlreadyCompleted: u64 = 1;
    const EInvalidModuleId: u64 = 2;

    /// One-time witness for the certificate module
    public struct CERTIFICATE has drop {}
    /// Certificate NFT - the badge that proves course completion
    public struct CourseCertificate has key, store {
        id: UID,
        /// Name of the certificate
        name: String,
        /// Description of the achievement
        description: String,
        /// Course ID that was completed
        course_id: String,
        /// Course name
        course_name: String,
        /// Learner's address
        learner: address,
        /// Timestamp when certificate was issued
        issued_at: u64,
        /// Image URL for the badge
        image_url: String,
    }

    /// Learning Progress - tracks module completion for a course
    public struct LearningProgress has key, store {
        id: UID,
        /// Course ID
        course_id: String,
        /// Learner's address
        learner: address,
        /// Module completion status (4 modules)
        module_1_completed: bool,
        module_2_completed: bool,
        module_3_completed: bool,
        module_4_completed: bool,
        /// Total modules completed
        modules_completed: u8,
    }

    /// Event emitted when a module is completed
    public struct ModuleCompleted has copy, drop {
        course_id: String,
        learner: address,
        module_id: u8,
    }

    /// Event emitted when a certificate is minted
    public struct CertificateMinted has copy, drop {
        certificate_id: address,
        course_id: String,
        learner: address,
        course_name: String,
    }

    /// Initialize the module - create Display for certificates
    fun init(otw: CERTIFICATE, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"course_name"),
            string::utf8(b"learner"),
            string::utf8(b"project_url"),
        ];

        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"{description}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{course_name}"),
            string::utf8(b"{learner}"),
            string::utf8(b"https://proofoflearning.iota"),
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<CourseCertificate>(
            &publisher, keys, values, ctx
        );
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    /// Start learning a course - creates a progress tracker
    public fun start_learning(
        course_id: vector<u8>,
        ctx: &mut TxContext
    ): LearningProgress {
        LearningProgress {
            id: object::new(ctx),
            course_id: string::utf8(course_id),
            learner: tx_context::sender(ctx),
            module_1_completed: false,
            module_2_completed: false,
            module_3_completed: false,
            module_4_completed: false,
            modules_completed: 0,
        }
    }

    /// Start learning and transfer progress to sender
    public entry fun start_learning_entry(
        course_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let progress = start_learning(course_id, ctx);
        transfer::public_transfer(progress, tx_context::sender(ctx));
    }

    /// Complete a specific module
    public entry fun complete_module(
        progress: &mut LearningProgress,
        module_id: u8,
        ctx: &mut TxContext
    ) {
        assert!(module_id >= 1 && module_id <= 4, EInvalidModuleId);
        
        if (module_id == 1) {
            assert!(!progress.module_1_completed, EModuleAlreadyCompleted);
            progress.module_1_completed = true;
        } else if (module_id == 2) {
            assert!(!progress.module_2_completed, EModuleAlreadyCompleted);
            progress.module_2_completed = true;
        } else if (module_id == 3) {
            assert!(!progress.module_3_completed, EModuleAlreadyCompleted);
            progress.module_3_completed = true;
        } else {
            assert!(!progress.module_4_completed, EModuleAlreadyCompleted);
            progress.module_4_completed = true;
        };

        progress.modules_completed = progress.modules_completed + 1;

        event::emit(ModuleCompleted {
            course_id: progress.course_id,
            learner: tx_context::sender(ctx),
            module_id,
        });
    }

    /// Check if all modules are completed
    public fun is_course_completed(progress: &LearningProgress): bool {
        progress.module_1_completed && 
        progress.module_2_completed && 
        progress.module_3_completed && 
        progress.module_4_completed
    }

    /// Mint certificate NFT after completing all modules
    public entry fun mint_certificate(
        progress: &LearningProgress,
        course_name: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(is_course_completed(progress), ENotAllModulesCompleted);

        let certificate = CourseCertificate {
            id: object::new(ctx),
            name: string::utf8(b"Proof of Learning Certificate"),
            description: string::utf8(b"This certificate proves successful completion of the course on IOTA blockchain"),
            course_id: progress.course_id,
            course_name: string::utf8(course_name),
            learner: progress.learner,
            issued_at: tx_context::epoch(ctx),
            image_url: string::utf8(image_url),
        };

        let cert_id = object::id_address(&certificate);

        event::emit(CertificateMinted {
            certificate_id: cert_id,
            course_id: progress.course_id,
            learner: progress.learner,
            course_name: string::utf8(course_name),
        });

        transfer::public_transfer(certificate, progress.learner);
    }

    /// View functions
    public fun get_progress_info(progress: &LearningProgress): (String, address, u8, bool) {
        (
            progress.course_id,
            progress.learner,
            progress.modules_completed,
            is_course_completed(progress)
        )
    }

    public fun get_certificate_info(cert: &CourseCertificate): (String, String, address, u64) {
        (
            cert.course_id,
            cert.course_name,
            cert.learner,
            cert.issued_at
        )
    }

    /// Get individual module completion status
    public fun get_module_status(progress: &LearningProgress, module_id: u8): bool {
        if (module_id == 1) {
            progress.module_1_completed
        } else if (module_id == 2) {
            progress.module_2_completed
        } else if (module_id == 3) {
            progress.module_3_completed
        } else if (module_id == 4) {
            progress.module_4_completed
        } else {
            false
        }
    }
}
