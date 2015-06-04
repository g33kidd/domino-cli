<?php
/*
 * Template Name: {{name}}
 */

get_header(); ?>
    
    <div class="container">
        <div class="row">
            <div id="primary" class="content-area <?= get_content_class(); ?>">
                <div id="main" class="site-main" role="main">
                    <!-- write page content here. -->
                </div>
            </div>
            <?php get_sidebar(); ?>
        </div>
    </div>

<?php get_footer(); ?>