<?php
/**
 * Plugin Name: Simple Block
 * Plugin URI: https://really-simple-plugins.com
 * Description: Example plugin to demonstrate usage of Gutenberg
 * Version: 1.0.0
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define('cmplz_url', plugin_dir_url(__FILE__));
define('cmplz_path', plugin_dir_path(__FILE__) );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @since 1.0.0
 */

function cmplz_editor_assets() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');
	wp_enqueue_script(
		'cmplz-block',
		cmplz_url. '/build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_localize_script(
		'cmplz-block',
		'complianz',
		array(
			'nonce' => wp_create_nonce( 'wp_rest' ),//to authenticate the logged in user
			'site_url' => get_rest_url(),
			'cmplz_preview' => cmplz_url.  'assets/images/gutenberg-preview.png',
		)
	);

	//run wp i18n make-pot . languages/complianz-gdpr.pot to create a pot file
	wp_set_script_translations( 'cmplz-block', 'complianz-gdpr' , cmplz_path . '/languages');
}
add_action( 'enqueue_block_editor_assets', 'cmplz_editor_assets' );

/**
 * Handles the front-end rendering of the complianz block
 *
 * @param $attributes
 * @param $content
 * @return string
 */
function cmplz_render_document_block($attributes, $content): string {
	$html = '';
	if ( isset($attributes['selectedDocument']) ) {
		$type = $attributes['selectedDocument'];
		$html = cmplz_render_shortcode($type);
	}

	return $html;
}
register_block_type('complianz/document', array(
	'render_callback' => 'cmplz_render_document_block',
));


/**
 * Set up a rest route to load the block options
 *
 */
add_action( 'rest_api_init', 'cmplz_documents_rest_route' );
function cmplz_documents_rest_route() {
	register_rest_route( 'complianz/v1', 'documents/', array(
		'methods'  => 'GET',
		'callback' => 'cmplz_rest_api_documents',
		'permission_callback' => function(){
			return is_user_logged_in();
		},
	) );
}

/**
 * Render an array of possible block outputs with title and id, called by the rest api
 * The id is used in the block shortcode
 *
 * @param WP_REST_Request $request
 *
 * @return array
 */

function cmplz_rest_api_documents( WP_REST_Request $request ): array {
	$output    = [];
	$types = [
		'Type A',
		'Type B',
	];

	foreach ( $types as $type ) {
		$output[] = [
			'id'      => $type,
			'title'   => $type,
			'content' => cmplz_render_shortcode( $type ),
		];
	}

	return $output;
}

/**
 * Placeholder function which could render a shortcode with a type property.
 * @param string $type
 *
 * @return string
 */
function cmplz_render_shortcode($type) {
	return "<p>This is some html of type $type</p>";
}