{{#bean}}
    <div class="layui-form-item">
        <label class="layui-form-label">标题</label>
        <div class="layui-input-block">
        	<input type="text" id="title" name="title" win-verify="required" placeholder="请输入标题" class="layui-input" value="{{forumTitle}}" />
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">标签</label>
        <div class="layui-input-block">
        	<input type="text" id="tagId" class="layui-input" />
        	<button type="button" class="layui-btn layui-btn-primary" id="chooseTag">选择标签</button>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">内容</label>
        <div class="layui-input-block">
        	<script id="container" name="content" type="text/plain"></script>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">匿名发布</label>
        <div class="layui-input-block">
        	<input type="checkbox" name="anonymous" lay-skin="switch" lay-filter="anonymous" value="{{compare5 anonymous}}" {{compare4 anonymous}} />
    	</div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">发布形式<i class="red">*</i></label>
        <div class="layui-input-block winui-radio">
            <input type="radio" name="forumType" value="1" title="公开" lay-filter="forumType" />
            <input type="radio" name="forumType" value="2" title="私密" lay-filter="forumType" />
        </div>
	</div>
    <div class="layui-form-item layui-col-xs12">
        <div class="layui-input-block">
            <button class="winui-btn" id="cancle">取消</button>
            <button class="winui-btn" lay-submit lay-filter="formEditBean">保存</button>
        </div>
    </div>
{{/bean}}